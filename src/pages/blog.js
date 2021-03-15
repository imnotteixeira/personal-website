import React from "react";
import { Link, graphql } from "gatsby";
import { css } from "@emotion/core";
import styled from "@emotion/styled";

import Layout from "../components/layout";
import SEO from "../components/seo";

const Content = styled.div`
  margin: 0 auto;
  max-width: 860px;
  padding: 1.45rem 1.0875rem;
`;

const ArticleDate = styled.h5`
  display: inline;
  color: #606060;
`;

const Badge = styled.h3`
  display: inline;
  font-size: 0.85rem;
    background-color: #d90909;
    color: white;
    border-radius: 10px;
    padding: .3rem;
    margin-right: 1em;
`;
const MarkerHeader = styled.h3`
  display: inline;
  
    background-image: linear-gradient(currentColor, currentColor);
    background-position: 0% 100%;
    background-repeat: no-repeat;
    background-size: 0% 2px;
    transition: background-size .3s;

    &:hover, &:focus {
        background-size: 100% 2px;
    }
`;

const ReadingTime = styled.h5`
  display: inline;
  color: #606060;
`;

const IndexPage = ({ data }) => (
    <Layout>
        <SEO title="Blog" />
        <Content>
            <h1>Blog</h1>
            {data.allMarkdownRemark.edges
                .filter(({ node }) => {
                    if (process.env.NODE_ENV === "production" && node.frontmatter.draft) return false;
                    const rawDate = node.frontmatter.rawDate;
                    const date = new Date(rawDate);
                    return date < new Date();
                })
                .map(({ node }) => (
                    <div key={node.id}>
                        <Link
                            to={node.frontmatter.path}
                            css={css`
                  text-decoration: none;
                  color: inherit;
                `}
                        >
                            {node.frontmatter.draft && <Badge>DRAFT</Badge>}
                            <MarkerHeader>
                                {node.frontmatter.title}
                            </MarkerHeader>
                        </Link>
                        <div>
                            <ArticleDate>
                                {node.frontmatter.date}
                            </ArticleDate>
                            <ReadingTime>
                                {` - ${node.fields.readingTime.text}`}
                            </ReadingTime>
                        </div>
                        <p>
                            {node.excerpt}
                        </p>
                    </div>
                ))}
        </Content>
    </Layout>
);

export default IndexPage;

export const query = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            date(formatString: "DD MMMM, YYYY")
            rawDate: date
            path
            draft
          }
          fields {
            slug
            readingTime {
              text
            }
          }
          excerpt
        }
      }
    }
  }
`;
