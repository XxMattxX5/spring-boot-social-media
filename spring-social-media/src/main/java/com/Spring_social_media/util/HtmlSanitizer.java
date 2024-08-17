package com.Spring_social_media.util;

import org.owasp.html.HtmlPolicyBuilder;
import org.owasp.html.PolicyFactory;
import org.springframework.stereotype.Component;

@Component
public class HtmlSanitizer {

    private final PolicyFactory policy;

    public HtmlSanitizer() {
        policy = new HtmlPolicyBuilder()
                .allowElements("a", "b", "i", "u", "p", "ul", "ol", "li", "strong", "em", "br", "img", "span")
                .allowUrlProtocols("http", "https")
                .allowAttributes("href").onElements("a")
                .allowAttributes("style").onElements("span")
                .allowAttributes("alt", "src").onElements("img")
                .toFactory();
    }

    public String sanitize(String html) {
        return policy.sanitize(html);
    }
}
