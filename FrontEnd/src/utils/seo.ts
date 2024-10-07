export const setSeo = (title: string, description: string, lang = 'de') => {
    // Set the document title
    document.title = title;

    // Set or update the meta description
    let descriptionTag = document.querySelector(
        'meta[name="description"]'
    ) as HTMLMetaElement;
    if (descriptionTag) {
        descriptionTag.setAttribute('content', description);
    } else {
        descriptionTag = document.createElement('meta');
        descriptionTag.name = 'description';
        descriptionTag.content = description;
        document.head.appendChild(descriptionTag);
    }

    // Set the language attribute in the <html> tag
    document.documentElement.lang = lang;

    // Optionally set Open Graph meta tags (for social media sharing)
    let ogTitleTag = document.querySelector('meta[property="og:title"]');
    if (!ogTitleTag) {
        ogTitleTag = document.createElement('meta');
        ogTitleTag.setAttribute('property', 'og:title');
        document.head.appendChild(ogTitleTag);
    }
    ogTitleTag.setAttribute('content', title);

    let ogDescriptionTag = document.querySelector(
        'meta[property="og:description"]'
    );
    if (!ogDescriptionTag) {
        ogDescriptionTag = document.createElement('meta');
        ogDescriptionTag.setAttribute('property', 'og:description');
        document.head.appendChild(ogDescriptionTag);
    }
    ogDescriptionTag.setAttribute('content', description);

    // Optionally set Twitter card meta tags
    let twitterTitleTag = document.querySelector('meta[name="twitter:title"]');
    if (!twitterTitleTag) {
        twitterTitleTag = document.createElement('meta');
        twitterTitleTag.setAttribute('name', 'twitter:title');
        document.head.appendChild(twitterTitleTag);
    }
    twitterTitleTag.setAttribute('content', title);

    let twitterDescriptionTag = document.querySelector(
        'meta[name="twitter:description"]'
    ) as HTMLMetaElement;
    if (!twitterDescriptionTag) {
        twitterDescriptionTag = document.createElement('meta');
        twitterDescriptionTag.setAttribute('name', 'twitter:description');
        document.head.appendChild(twitterDescriptionTag);
    }
    twitterDescriptionTag.setAttribute('content', description);
};
