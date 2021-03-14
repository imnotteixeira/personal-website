import React from "react";
import PropTypes from "prop-types";
import { StaticQuery, graphql } from "gatsby";
import styled from "@emotion/styled";
import reactStringReplace from "react-string-replace";
import ReactTyped from "react-typed";

const Container = styled.div`
  text-align: center;
`;

const OuterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  height: 78vh;
`;

const Description = styled.p`
  padding: 0;
  margin-bottom: 1rem;
  font-size: 1.4rem;
`;

const NameHeader = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 0;
`;

const LandingBio = () => (
    <StaticQuery
        query={graphql`
      query LandingSiteTitleQuery {
        site {
          siteMetadata {
            title
            subtitles
          }
        }
      }
    `}
        render={(data) => (
            <OuterContainer>
                <Container>
                    <NameHeader>
                        {data.site.siteMetadata.title}
                    </NameHeader>
                    <Description>
                        {reactStringReplace("%WORDS%", "%WORDS%", (match, i) => (
                            <ReactTyped
                                strings={data.site.siteMetadata.subtitles}
                                typeSpeed={50}
                                backSpeed={60}
                                backDelay={1500}
                                loop={true}
                                key={match + i}
                            />
                        ))}
                    </Description>
                </Container>
            </OuterContainer>
        )}
    />
);

NameHeader.propTypes = {
    siteTitle: PropTypes.string,
    subtitle: PropTypes.string,
};

NameHeader.defaultProps = {
    siteTitle: "",
    subtitle: "",
};

export default LandingBio;
