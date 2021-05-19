package fabel;

import static ox.util.Utils.count;

import java.util.List;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;

import com.google.common.base.CharMatcher;

import ox.IO;
import ox.Log;
import ox.util.Matchers;

/**
 * To create a new test:
 * 
 * npx babel fabel/test/fabel/files/fabel-test11.jsx > fabel/test/fabel/files/fabel-test11-output.jsx
 */
public class FabelTest {

  @ParameterizedTest
  @MethodSource("getFilesToTest")
  public void transpileTest(String file) {
    String input = IO.from(Fabel.class, "files/" + file + ".jsx").toString();
    Fabel fabel = new Fabel();
    String actual = fabel.transpile(input);

    String expected = IO.from(Fabel.class, "files/" + file + "-output.jsx").toString();

    compare(actual, expected);
  }

  public static List<String> getFilesToTest() {
    return count(1, 13).map(i -> "fabel-test" + i);
  }

  private static void compare(String actual, String expected) {
    String s1 = strip(actual);
    String s2 = strip(expected);

    Log.debug(actual + "\nvs\n" + expected);

    if (!s1.equals(s2)) {
      for (int i = 0; i < s2.length(); i++) {
        char c1 = s1.charAt(i);
        char c2 = s2.charAt(i);
        if (c1 != c2) {
          Log.debug("actual:   " + s1.substring(Math.max(0, i - 10)));
          Log.debug("expected: " + s2.substring(Math.max(0, i - 10)));

          Log.debug("\n\n" + actual);
          break;
        }
      }

      throw new RuntimeException("Doesn't match!");
    }
  }

  private static String strip(String s) {
    return Matchers.whitespace().or(CharMatcher.anyOf("(),;")).removeFrom(s);
  }

}
