import styled from 'styled-components/native';

export const Small = styled.ImageBackground`
  width: 100%;
  aspect-ratio: ${ props => props.ratio };
`;

export const OriginalImage = styled.Image`
  width: 100%;
  aspect-ratio: ${ props => props.ratio };
`;
