module.exports = {
    siteMetadata: {
        title: `Angelo Teixeira`,
        subtitles: ["software developer", "software enthusiast", "software learner", "software builder", "software explorer"],
        description: `It's a blog with some extras about me, I guess.`,
        author: `@tngelo_aeixeira`,
        shareImage: `https://angeloteixeira.me/share-image.jpg`
    },
    plugins: [
        `gatsby-plugin-react-helmet`,
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `markdown-pages`,
                path: `${__dirname}/src/content`,
            },
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `images`,
                path: `${__dirname}/src/images`,
            },
        },
        `gatsby-transformer-sharp`,
        `gatsby-plugin-sharp`,
        `gatsby-plugin-emotion`,
        {
            resolve: `gatsby-transformer-remark`,
            options: {
                "excerpt_separator": `<!-- end_excerpt -->`,
                plugins: [
                    `gatsby-remark-reading-time`, {
                        resolve: `gatsby-remark-prismjs`,
                        options: {
                            aliases: { sh: "bash", js: "javascript" },
                            showLineNumbers: true,
                        }
                    },
                    {
                        resolve: 'gatsby-remark-images',
                        options: {
                            linkImagesToOriginal: false,
                        },
                    },
                    {
                        resolve: "gatsby-remark-custom-blocks",
                        options: {
                            blocks: {
                                hidden: {
                                    classes: "hidden",
                                },
                                danger: {
                                    classes: "danger",
                                    title: "optional",
                                },
                                warning: {
                                    classes: "warning",
                                    title: "optional",
                                },
                                info: {
                                    classes: "info",
                                    title: "optional",
                                },
                            },
                        },
                    },
                    `gatsby-remark-images-zoom`,
                    `gatsby-remark-copy-linked-files`
                ],
            },
        },
        {
            resolve: `gatsby-plugin-netlify`,
            options: {
                headers: {
                    "/*": [
                        "Strict-Transport-Security: max-age=63072000"
                    ]
                }, // option to add more headers. `Link` headers are transformed by the below criteria
                allPageHeaders: [], // option to add headers for all pages. `Link` headers are transformed by the below criteria
                mergeSecurityHeaders: true, // boolean to turn off the default security headers
                mergeLinkHeaders: true, // boolean to turn off the default gatsby js headers
                mergeCachingHeaders: true, // boolean to turn off the default caching headers
                transformHeaders: (headers, path) => headers, // optional transform for manipulating headers under each path (e.g.sorting), etc.
                generateMatchPathRewrites: true, // boolean to turn off automatic creation of redirect rules for client only paths
            },
        },
        {
            resolve: `gatsby-plugin-manifest`,
            options: {
                name: `gatsby-starter-default`,
                short_name: `starter`,
                start_url: `/`,
                background_color: `#663399`,
                theme_color: `#663399`,
                display: `minimal-ui`,
                // icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
            },
        },
        // this (optional) plugin enables Progressive Web App + Offline functionality
        // To learn more, visit: https://gatsby.dev/offline
        // 'gatsby-plugin-offline',
    ],
}
