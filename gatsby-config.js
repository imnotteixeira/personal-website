module.exports = {
    siteMetadata: {
        title: `Angelo Teixeira`,
        subtitles: ["software developer", "software enthusiast", "software learner", "software builder", "software explorer"],
        description: `It's a blog with some extras about me, I guess.`,
        author: `@tngelo_aeixeira`,
        shareImage: `https://angeloteixeira.me/share-image.jpg`,
        siteUrl: `https://angeloteixeira.me`,
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
        {
            resolve: "gatsby-plugin-feed",
            options: {
                feeds: [
                    {
                        serialize: ({ query: { site, allMarkdownRemark } }) => {
                            return allMarkdownRemark.edges.map(edge => {
                              return Object.assign({}, edge.node.frontmatter, {
                                description: edge.node.excerpt,
                                date: edge.node.frontmatter.date,
                                url: site.siteMetadata.siteUrl + edge.node.frontmatter.path,
                                guid: site.siteMetadata.siteUrl + edge.node.frontmatter.path,
                                custom_elements: [{ 'content:encoded': edge.node.html }],
                              });
                            });
                          },
                        query: `
                        {
                            allMarkdownRemark(
                                sort: { fields: [frontmatter___date], order: DESC },
                                filter: {
                                    frontmatter: {
                                        draft: {ne: true}
                                    }
                                }
                            ) {
                                edges {
                                    node {
                                        excerpt
                                        html
                                        fields { slug }
                                        frontmatter {
                                            title
                                            date
                                            path
                                        }
                                    }
                                }
                            }
                        }
                        `,
                        title: "Angelo Teixeira's Blog",
                        output: "/rss.xml",
                    },
                    
                ],
            },
        },
        {
            resolve: `gatsby-plugin-google-gtag`,
            options: {
              // You can add multiple tracking ids and a pageview event will be fired for all of them.
              trackingIds: [
                (console.log("GGL_TRK_ID", process.env.GOOGLE_ANALYTICS_TRCAKING_ID), process.env.GOOGLE_ANALYTICS_TRCAKING_ID), // Google Analytics / GA
                // "AW-CONVERSION_ID", // Google Ads / Adwords / AW
                // "DC-FLOODIGHT_ID", // Marketing Platform advertising products (Display & Video 360, Search Ads 360, and Campaign Manager)
              ],
              // This object gets passed directly to the gtag config command
              // This config will be shared across all trackingIds
              gtagConfig: {
                optimize_id: "OPT_CONTAINER_ID",
                anonymize_ip: true,
                cookie_expires: 0,
              },
              // This object is used for configuration specific to this plugin
              pluginConfig: {
                // Puts tracking script in the head instead of the body
                head: false,
                // Setting this parameter is also optional
                respectDNT: true,
                // Avoids sending pageview hits from custom paths
                exclude: [],
              },
            },
        }

        // this (optional) plugin enables Progressive Web App + Offline functionality
        // To learn more, visit: https://gatsby.dev/offline
        // 'gatsby-plugin-offline',
    ],
}
