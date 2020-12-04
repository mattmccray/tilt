import { html, styled } from '../../../../lib'

export function Button(props, children) {
  return html`
    <button ${{ ...props }}>${children}</button>
  `
}

export const PlainButton = styled.button`
  -webkit-appearance: none;
  border: 0px;
`