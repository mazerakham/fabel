package fabel;

import static com.google.common.base.Preconditions.checkState;
import static ox.util.Utils.trim;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.google.common.collect.Lists;

import bowser.node.DomNode;
import bowser.node.DomParser;
import bowser.node.TextNode;
import ox.IO;
import ox.Log;

public class JSXParser {

  private static final Pattern htmlTagPattern = Pattern.compile("<([\\w-]+)(\\s.*?)*>|\\/\\*.*\\*\\/|\\/\\/.*?\\n",
      Pattern.DOTALL);

  public DomNode parse(String input) {
    DomNode ret = new DomNode("jsx");
    parseJS(ret, input);
    return ret;
  }

  private void parseJS(DomNode parent, String input) {
    JSWrapper jsWrapper = new JSWrapper();
    Matcher matcher = htmlTagPattern.matcher(input);
    int lastIndex = -1;
    while (matcher.find(lastIndex + 1)) {
      String src = input.substring(lastIndex + 1, matcher.start());
      jsWrapper.add(new JavascriptNode(src));
      char c = input.charAt(matcher.start());
      if (c == '<') {
        int endTagIndex = findEndTag(input, matcher);
        lastIndex = endTagIndex;
        parseHtml(jsWrapper, input, matcher.start(), endTagIndex + 1);
      } else {
        jsWrapper.add(new JavascriptNode(matcher.group()));
        lastIndex = matcher.end();
      }
    }
    jsWrapper.add(new JavascriptNode(input.substring(lastIndex + 1)));
    parent.add(jsWrapper);
  }

  private void parseHtml(DomNode parent, String s, int start, int end) {
    if (start == end) {
      return;
    }

    // Log.debug("PARSEHTML()");
    // Log.debug(s.substring(start, end));
    // Log.debug("=====================");

    if (s.charAt(start) != '<') {
      int tagIndex = end;
      int jsIndex = end;
      char c;
      for (int i = start; i < end; i++) {
        c = s.charAt(i);
        if (c == '<') {
          tagIndex = i;
          break;
        } else if (c == '{') {
          jsIndex = i;
          break;
        }
      }
      if (jsIndex < tagIndex) {
        parent.add(new TextNode(s.substring(start, jsIndex)));
        int endJsIndex = findEndJsIndex(s, jsIndex);
        parseJS(parent, s.substring(jsIndex + 1, endJsIndex));
        parseHtml(parent, s, endJsIndex + 1, end);
      } else {
        parent.add(new TextNode(s.substring(start, tagIndex)));
        parseHtml(parent, s, tagIndex, end);
      }
      return;
    }

    int endOfStartTag = findEndOfStartTag(s, start);
    String tagData = s.substring(start + 1, endOfStartTag);
    tagData = tagData.replace('\n', ' ');
    List<String> m = split(tagData, ' ');

    DomNode node = new DomNode(m.get(0));
    for (int i = 1; i < m.size(); i++) {
      String attribute = m.get(i);
      attribute = trim(attribute);
      if (attribute.isEmpty() || attribute.equals("/")) {
        continue;
      }
      int index = attribute.indexOf('=');
      if (index == -1) {
        node.attribute(attribute);
      } else {
        node.attribute(attribute.substring(0, index), attribute.substring(index + 1));
      }
    }

    parent.add(node);

    Integer endTagIndex;
    if (s.charAt(endOfStartTag - 1) == '/') {
      // self-closing tag.
      node.selfClosingNode = true;
      endTagIndex = null;
    } else {
      endTagIndex = DomParser.findEndTag(node.tag, s, endOfStartTag + 1, end);
    }

    if (endTagIndex != null) {
      if (node.tag.equalsIgnoreCase("script") /* || node.tag.equalsIgnoreCase("template") */
          || node.tag.equalsIgnoreCase("code") || node.tag.equalsIgnoreCase("svg")) {
        node.add(new TextNode(s.substring(endOfStartTag + 1, endTagIndex)));
      } else {
        // Recursive step: parse the children of a node, adding them to the node.
        parseHtml(node, s, endOfStartTag + 1, endTagIndex);
      }
      endOfStartTag = endTagIndex + 2 + node.tag.length();
    }

    parseHtml(parent, s, endOfStartTag + 1, end);
  }

  private int findEndJsIndex(String s, int i) {
    // int originalI = i;
    int depth = 0;
    for (; i < s.length(); i++) {
      char c = s.charAt(i);
      if (c == '{') {
        depth++;
      } else if (c == '}') {
        depth--;
        if (depth == 0) {
          return i;
        }
      }
    }
    throw new IllegalStateException("Could not find end index of js.");
  }

  private int findEndTag(String s, Matcher matcher) {
    boolean selfClosingTag = matcher.group().contains("/>");
    if (selfClosingTag) {
      return matcher.end() - 1;
    } else {
      Integer endIndex = DomParser.findEndTag(matcher.group(1), s, matcher.end(), s.length());
      checkState(endIndex != null, "Could not find end tag.");
      return s.indexOf(">", endIndex);
    }
  }

  /**
   * Unlike DomParser.split, this accounts for javascript values. e.g onClick={selectAll}
   */
  public static List<String> split(String s, char z) {
    List<String> ret = Lists.newArrayList();
    StringBuilder sb = new StringBuilder();
    boolean inQuote = false;
    boolean inJs = false;
    for (int i = 0; i < s.length(); i++) {
      char c = s.charAt(i);
      if (c == '"') {
        if (inJs) {
          sb.append(c);
        } else {
          inQuote = !inQuote;
        }
      } else if (!inQuote && c == '{') {
        inJs = true;
        sb.append(c);
      } else if (!inQuote && c == '}') {
        inJs = false;
        sb.append(c);
      } else {
        if (!inQuote && !inJs && c == z) {
          ret.add(sb.toString());
          sb.setLength(0);
        } else {
          sb.append(c);
        }
      }
    }
    if (sb.length() > 0) {
      ret.add(sb.toString());
    }
    return ret;
  }

  public static int findEndOfStartTag(String s, int start) {
    boolean insideQuotes = false;
    boolean inJs = false;
    for (int i = start; i < s.length(); i++) {
      char c = s.charAt(i);
      if (insideQuotes) {
        if (c == '"') {
          insideQuotes = false;
        }
      } else if (inJs) {
        if (c == '}') {
          inJs = false;
        }
      } else {
        if (c == '>') {
          return i;
        } else if (c == '"') {
          insideQuotes = true;
        } else if (c == '{') {
          inJs = true;
        }
      }
    }
    throw new RuntimeException("Could not find end of start tag!");
  }

  public static void main(String[] args) {
    // Log.debug(JSXParser.split("button className=\"property-tag__x-btn\" onClick={() => handleClick(id)}", ' '));
    String input = IO.from(Fabel.class, "files/fabel-test13.jsx").toString();
    Log.debug(new JSXParser().parse(input));
  }

}
