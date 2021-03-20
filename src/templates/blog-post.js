import React from "react";
import { graphql } from "gatsby";
import styled from "@emotion/styled";
import Layout from "../components/layout";
import SEO from "../components/seo";

const Content = styled.div`
  margin: 0 auto;
  max-width: 860px;
  padding: 1.45rem 1.0875rem;
`;

const MarkedHeader = styled.h1`
  display: inline;
`;

const HeaderDate = styled.h3`
  margin-top: 10px;
  color: #606060;
`;

// STYLE THE TAGS INSIDE THE MARKDOWN HERE
const MarkdownContent = styled.div`
  a {
    text-decoration: none;
    position: relative;

    background-image: linear-gradient(
      rgba(255, 250, 150, 0.8),
      rgba(255, 250, 150, 0.8)
    );
    background-repeat: no-repeat;
    background-size: 100% 0.2em;
    background-position: 0 88%;
    transition: background-size 0.25s ease-in;
    &:hover {
      background-size: 100% 88%;
    }
  }

  a > code:hover {
    text-decoration: underline;
  }

  blockquote {
      background-color: rgba(255, 250, 150, 0.8);
      font-style: italic;
      padding: 1em;
      border-radius: 0.3em;
      color: #555
  }

  code:not(pre code) {
      color: rgba(255, 250, 150, 0.8);
      padding-left: 0.5em;
      padding-right: 0.5em;
      display: inline-block;
  }

  .custom-block {
      padding: 1em;
      border-radius: 0.3em;
      margin-bottom: 1rem;
  }
  
  .custom-block-heading {
      font-weight: bold;
  }
  .custom-block-body {
      margin-top: 1rem;
  }
  .custom-block-body p {
      margin-bottom: 0;
  }

  .custom-block.hidden {
      display: none;
  }
  .custom-block.info {
      background-color: rgba(66, 166, 189, 0.3)
  }
  .custom-block.warning {
      background-color: rgba(230, 206, 80, 0.3)
  }
  .custom-block.danger {
      background-color: rgba(230, 80, 80, 0.3)
  }

`;

export default ({ data }) => {
    const post = data.markdownRemark;
    return (
        <Layout>
            <SEO
                title={post.frontmatter.title}
                description={post.frontmatter.description || post.excerpt}
            />
            <Content>
                <MarkedHeader>
                    {post.frontmatter.title}
                </MarkedHeader>
                <HeaderDate>
                    {post.frontmatter.date}
                    {" "}
                    -
                    {" "}
                    {post.fields.readingTime.text}
                </HeaderDate>
                <MarkdownContent dangerouslySetInnerHTML={{ __html: post.html }} />
            </Content>
        </Layout>
    );
};

export const pageQuery = graphql`
  query($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      excerpt(pruneLength: 160)
      frontmatter {
        date(formatString: "DD MMMM, YYYY")
        path
        title
      }
      fields {
        readingTime {
          text
        }
      }
    }
  }
`;
