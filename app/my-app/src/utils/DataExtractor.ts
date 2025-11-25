export interface CSVOptions {
  delimiter?: string;
  header?: boolean;
  flatten?: boolean;
  fields?: string[];
  lineEnding?: "\n" | "\r\n";
  nullAsEmpty?: boolean;
  includeBom?: boolean;
}

export interface CSVDownloadOptions {
  filename?: string;
  contentType?: "text/csv;charset=utf-8" & string;
}

export default class DataExtractor {
  private constructor() {}

  public static exportCSV(csvData: string, options?: CSVDownloadOptions) {
    const contentType = options?.contentType ?? "text/csv;charset=utf-8";
    const filename = options?.filename ?? "export.csv";

    const blob = new Blob([csvData], { type: contentType });
    const url = URL.createObjectURL(blob);

    // Create a link to download it
    const pom = document.createElement("a");
    pom.href = url;
    pom.setAttribute("download", filename);
    pom.click();
  }

  public static jsonToCSV(input: unknown, options: CSVOptions = {}): string {
    const delimiter = options.delimiter ?? ",";
    const includeHeader = options.header ?? true;
    const flatten = options.flatten ?? true;
    const EOL = options.lineEnding ?? "\n";
    const nullAsEmpty = options.nullAsEmpty ?? true;
    const includeBom = options.includeBom ?? false;

    // Normalize input to an array of "records"
    const arr: unknown[] = Array.isArray(input) ? input : [input];

    // Convert each item to a flat record or a shallow record
    const records: Record<string, unknown>[] = arr.map((item) => {
      if (flatten) {
        return this.flattenRecord(item);
      } else {
        // No flatten: top-level only
        if (item !== null && typeof item === "object") {
          return item as Record<string, unknown>;
        }
        // Primitive fallback
        return { value: item };
      }
    });

    // Determine the header fields (order of first appearance) unless provided
    const fields = options.fields ?? this.inferFields(records);

    // If there are no fields (e.g., empty input), return empty or BOM only
    if (fields.length === 0) {
      return includeBom ? "\ufeff" : "";
    }

    // Build CSV
    const lines: string[] = [];

    if (includeHeader) {
      lines.push(this.joinRow(fields, delimiter));
    }

    for (const rec of records) {
      const row = fields.map((f) =>
        this.escapeCell(rec[f], delimiter, nullAsEmpty),
      );
      lines.push(row.join(delimiter));
    }

    const csv = lines.join(EOL);
    return includeBom ? "\ufeff" + csv : csv;
  }

  /**
   * Deeply flatten any JSON-like value into a single-level record mapping
   * keys like "a.b.0.c" -> value. Primitives go under key "value".
   */
  private static flattenRecord(input: unknown): Record<string, unknown> {
    const out: Record<string, unknown> = {};

    const walk = (val: unknown, path: string[]) => {
      // Handle Dates explicitly
      if (val instanceof Date) {
        set(path, val.toISOString());
        return;
      }

      // Null or non-object => leaf
      if (val === null || typeof val !== "object") {
        set(path, val);
        return;
      }

      // Arrays
      if (Array.isArray(val)) {
        for (let i = 0; i < val.length; i++) {
          walk(val[i], path.concat(String(i)));
        }
        // Note: empty arrays produce no keys; if you want a key, uncomment:
        // if (val.length === 0) set(path, '');
        return;
      }

      // Plain objects
      for (const [k, v] of Object.entries(val)) {
        walk(v, path.concat(k));
      }
    };

    const set = (path: string[], value: unknown) => {
      const key = path.length === 0 ? "value" : path.join(".");
      out[key] = value;
    };

    walk(input, []);
    return out;
  }

  /**
   * Infer fields from union of keys across records, preserving first-seen order.
   */
  private static inferFields(records: Record<string, unknown>[]): string[] {
    const seen = new Set<string>();
    const order: string[] = [];
    for (const r of records) {
      for (const k of Object.keys(r)) {
        if (!seen.has(k)) {
          seen.add(k);
          order.push(k);
        }
      }
    }
    return order;
  }

  /**
   * Escape a CSV cell using RFC 4180 rules.
   * - Enclose in double quotes if it contains delimiter, quotes, or newlines.
   * - Double any internal quotes.
   * - Convert objects to JSON (when not flattened).
   * - Render null/undefined as empty if nullAsEmpty=true.
   */
  private static escapeCell(
    value: unknown,
    delimiter: string,
    nullAsEmpty: boolean,
  ): string {
    // Normalize value to string
    let str: string;

    if (value === null || value === undefined) {
      str = nullAsEmpty ? "" : String(value);
    } else if (value instanceof Date) {
      str = value.toISOString();
    } else if (typeof value === "string") {
      str = value;
    } else if (
      typeof value === "number" ||
      typeof value === "boolean" ||
      typeof value === "bigint"
    ) {
      str = String(value);
    } else {
      // For non-flattened nested values, serialize
      try {
        str = JSON.stringify(value);
      } catch {
        // Fallback if stringify fails (e.g., circular refs)
        str = String(value);
      }
    }

    const needsQuoting =
      str.includes('"') ||
      str.includes("\n") ||
      str.includes("\r") ||
      str.includes(delimiter);

    if (needsQuoting) {
      str = '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  }

  /**
   * Join header row cells with delimiter (escape like data cells).
   */
  private static joinRow(cells: string[], delimiter: string): string {
    // Header cells need the same escaping rules
    return cells
      .map((c) => this.escapeCell(c, delimiter, false))
      .join(delimiter);
  }
}
