import styled from "styled-components"
import { OswaldFontFamily } from "../../common"

const Button = styled.span`
    ${OswaldFontFamily}
    border: 1px solid #ea3012;
    background: rgba(159,22,0,.6);
    user-select: none;
    cursor: pointer;
    color: #f7b10a;
    text-transform: uppercase;
    font-size: 20px;
    font-weight: 400;
    padding: 12px 30px;
    border-radius: 2px;
    text-align: center;

    &:hover {
        background: rgba(159,22,0,.8);
    }
`

const LandingButton = (props: { href?: string, target?: string, className?: string, children: React.ReactNode }) =>
    <a href={props.href} target={props.target}><Button className={props.className}>{props.children}</Button></a>

export default LandingButton