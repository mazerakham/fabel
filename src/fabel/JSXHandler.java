package fabel;

import static com.google.common.base.Preconditions.checkNotNull;

import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import com.google.common.collect.Maps;

import bowser.WebServer;
import bowser.model.Request;
import bowser.model.RequestHandler;
import bowser.model.Response;

public class JSXHandler implements RequestHandler {

  private final WebServer server;
  private final Fabel fabel = new Fabel();

  private final Map<String, String> cache = Maps.newConcurrentMap();

  public JSXHandler(WebServer server) {
    this.server = server;
  }

  @Override
  public boolean process(Request request, Response response) {
    if (!request.path.endsWith(".jsx")) {
      return false;
    }

    String s = null;

    if (server.enableCaching) {
      s = cache.get(request.path);
    }

    if (s == null) {
      byte[] data = server.getResourceLoader().getData(request.path);
      checkNotNull(data);
      data = server.getCacheBuster().hashMJSImports(data).getBytes(StandardCharsets.UTF_8);

      s = new String(data, StandardCharsets.UTF_8);
      s = fabel.transpile(s);
      cache.put(request.path, s);
    }

    response.contentType("text/javascript");
    response.cacheFor(365, TimeUnit.DAYS);
    response.write(s);

    return true;
  }

}
