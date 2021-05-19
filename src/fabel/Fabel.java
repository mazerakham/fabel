package fabel;

import static com.google.common.base.Preconditions.checkState;

import java.util.List;

import bowser.node.DomNode;
import bowser.node.TextNode;
import ox.util.Matchers;

/**
 * 15000x Faster than Babel. Transpiles jsx files.
 * 
 * @author Jason Mirra
 */
public class Fabel {

  private static final char QUOTE = '"';

  public String transpile(String s) {
    DomNode jsx = new JSXParser().parse(s);
    StringBuilder sb = new StringBuilder();
    for (DomNode child : jsx.getChildren()) {
      render(child, sb, 0);
    }
    return sb.toString();
  }

  private void render(DomNode node, StringBuilder sb, int depth) {
    // for (int i = 0; i < depth; i++) {
    // System.out.print("\t");
    // }
    // Log.debug(node.getClass().getSimpleName());
    //
    // Log.debug(node);

    if (node instanceof JavascriptNode) {
      // Log.debug("JS: " + node);
      node.render(sb, depth);
    } else if (node instanceof JSWrapper) {
      // node.getChildren().removeIf(n -> n instanceof TextNode && normalize(n.text()).isEmpty());
      node.getChildren().forEach(child -> render(child, sb, depth + 1));
    } else {
      renderHtmlNode(node, sb, depth);
    }
  }

  private void renderHtmlNode(DomNode e, StringBuilder sb, int depth) {
    // e.getChildren().removeIf(node -> node instanceof TextNode && normalize(node.text()).isEmpty());

    sb.append("React.createElement(");
    String tagName = e.tag;
    if (Character.isLowerCase(tagName.charAt(0))) {
      tagName = quote(tagName);
    }
    sb.append(tagName);
    List<String> attrs = e.getAttributes();
    // Log.debug(attrs);

    if (attrs.size() == 0) {
      sb.append(", null");
    } else {
      sb.append(", {");
      for (int i = 0; i < attrs.size(); i += 2) {
        String key = attrs.get(i);
        if (key.startsWith("{...")) {
          checkState(attrs.get(i + 1) == null);
          sb.append(key.substring(1, key.length() - 1));
        } else {
          if (key.contains("-")) {
            key = quote(key);
          }
          sb.append(key);
          sb.append(": ");
          String value = attrs.get(i + 1);
          if (value == null) {
            sb.append("true");
          } else {
            if (value.startsWith("{")) {
              sb.append(value.substring(1, value.length() - 1));
            } else {
              sb.append(quote(value));
            }
          }
        }
        sb.append(", ");
      }
      sb.append("}");
    }
    sb.append(", ");
    e.getChildren().forEach(childNode -> {
      if (childNode instanceof TextNode) {
        TextNode child = (TextNode) childNode;
        // Log.debug("<a>" + child.text().replace("\n", "\\n") + "</a> ==>");
        String s = smartTrim(child.text());
        // Log.debug("<b>" + s.replace("\n", "\\n") + "</b>");
        if (!s.isEmpty()) {
          sb.append(quote(s)).append(", ");
        }
      } else {
        boolean isJsNode = childNode instanceof JavascriptNode;
        if (isJsNode) {
          // if (sb.charAt(sb.length() - 2) == ',') {
          // sb.delete(sb.length() - 2, sb.length());
          // }
        } else {
          sb.append("\n");
          for (int i = 0; i < depth + 2; i++) {
            sb.append(" ");
          }
        }

        render(childNode, sb, depth + 1);
        if (!isJsNode) {
          sb.append(", ");
        }
      }
    });
    if (sb.charAt(sb.length() - 2) == ',') {
      sb.delete(sb.length() - 2, sb.length());
    }
    sb.append(")");
  }

  private static String smartTrim(String s) {
    int i = s.indexOf('\n');
    if (i == -1) {
      return s;
    }
    if (Matchers.whitespace().matchesAllOf(s.substring(0, i))) {
      s = Matchers.whitespace().trimLeadingFrom(s);
    }
    i = s.lastIndexOf('\n');
    if (i == -1) {
      return s;
    }
    if (Matchers.whitespace().matchesAllOf(s.substring(i))) {
      s = s.substring(0, i);
    }
    return s;
  }

  private static String quote(String s) {
    StringBuilder sb = new StringBuilder(s.length() + 2);
    sb.append(QUOTE);
    sb.append(s);
    sb.append(QUOTE);
    return sb.toString();
  }

}
