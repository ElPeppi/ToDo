import type { JSX } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
    title: string;
    route: string;
    iconName?: JSX.Element;
}
function Item({title, route, iconName}: Props) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(route);
    };


    return (
        <li className="menu-item" onClick={handleClick}>
            {iconName && <span className="menu-icon">{iconName}</span>}
            <span>{title}</span>
        </li>
    );
}

export default Item;
