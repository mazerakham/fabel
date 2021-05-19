package fabel;

import bowser.node.DomNode;

public class JavascriptNode extends DomNode {

  public final String src;

  public JavascriptNode(String src) {
    this.src = src;
  }

  @Override
  public String toString() {
    return "<js>" + src + "</js>";
  }

  @Override
  public void render(StringBuilder sb, int depth) {
    sb.append(src);
  }

}
