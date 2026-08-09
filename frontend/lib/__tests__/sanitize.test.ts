import { describe, expect, it } from "vitest";
import { sanitizeHtml } from "../sanitize";

describe("sanitizeHtml", () => {
  it("mantém estrutura básica e classes", () => {
    const html = sanitizeHtml(
      '<div class="md-image"><img src="/x.png" alt=""><h2>T</h2><mark>m</mark></div>'
    );
    expect(html).toContain('<div class="md-image">');
    expect(html).toContain('<img src="/x.png" alt=""');
    expect(html).toContain("<mark>m</mark>");
  });

  it("remove script, style, object, embed, form", () => {
    const html = sanitizeHtml(
      '<script>x</script><style>y</style><object data="z"></object><embed src="w"><form action="f"></form>'
    );
    expect(html).not.toContain("<script");
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<object");
    expect(html).not.toContain("<embed");
    expect(html).not.toContain("<form");
  });

  it("remove handlers on* e atributo style", () => {
    const html = sanitizeHtml('<p onclick="x()" style="color:red">t</p>');
    expect(html).toBe("<p>t</p>");
  });

  it("remove javascript: e data: dos schemes", () => {
    expect(sanitizeHtml('<a href="javascript:alert(1)">x</a>')).not.toContain("javascript:");
    expect(sanitizeHtml('<img src="data:text/html;base64,x">')).not.toContain("data:text/html");
  });

  it("mantém href https com target/rel", () => {
    const html = sanitizeHtml(
      '<a href="https://ex.org" target="_blank" rel="noopener noreferrer">x</a>'
    );
    expect(html).toContain('href="https://ex.org" target="_blank" rel="noopener noreferrer"');
  });

  it("mantém iframe youtube e vimeo, remove outros", () => {
    expect(
      sanitizeHtml('<iframe src="https://www.youtube.com/embed/abc"></iframe>')
    ).toContain("youtube.com");
    expect(
      sanitizeHtml('<iframe src="https://player.vimeo.com/video/123"></iframe>')
    ).toContain("vimeo.com");
    expect(sanitizeHtml('<iframe src="https://evil.com/x"></iframe>')).not.toContain("<iframe");
  });

  it("remove iframe sem src", () => {
    expect(sanitizeHtml("<iframe></iframe>")).not.toContain("<iframe");
  });

  it("mantém tabelas", () => {
    const html = sanitizeHtml(
      '<table><thead><tr><th>A</th></tr></thead><tbody><tr><td>1</td></tr></tbody></table>'
    );
    expect(html).toContain("<table>");
    expect(html).toContain("<th>A</th>");
  });
});
