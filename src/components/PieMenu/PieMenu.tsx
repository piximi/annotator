import React, {
  CSSProperties,
  MouseEvent,
  ReactElement,
  useState,
} from "react";
import Tooltip, { TooltipProps } from "@material-ui/core/Tooltip/Tooltip";
import MailIcon from "@material-ui/icons/Mail";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import MapIcon from "@material-ui/icons/Map";
import InfoIcon from "@material-ui/icons/Info";

interface CircleButtonProps {
  className?: string;
  link?: string;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  size: number;
  style?: CSSProperties;
  target?: string;
  tooltip?: string;
  tooltipPlacement?: TooltipProps["placement"];
}

const CircleButton: React.FunctionComponent<CircleButtonProps> = (props) => {
  const ButtonTag = props.link ? "a" : "div";

  return (
    <Tooltip
      title={props.tooltip ? props.tooltip : ""}
      placement={props.tooltipPlacement}
    >
      <ButtonTag
        href={props.link}
        target={props.target}
        onClick={props.onClick}
        className={
          "circle-button" + (props.className ? " " + props.className : "")
        }
        style={{
          width: props.size + "em",
          height: props.size + "em",
          ...props.style,
        }}
      >
        {props.children}
      </ButtonTag>
    </Tooltip>
  );
};

interface CircleMenuToggleProps {
  size: number;
  toggleMenu: () => void;
}

const CircleMenuToggle: React.FunctionComponent<CircleMenuToggleProps> = ({
  size = 1,
  ...props
}) => {
  return (
    <CircleButton
      onClick={props.toggleMenu}
      size={size}
      className="circle-menu-toggle"
    >
      <div className="circle-menu-burger">
        <span className="circle-menu-burger-bar" />
        <span className="circle-menu-burger-bar" />
        <span className="circle-menu-burger-bar" />
      </div>
    </CircleButton>
  );
};

interface CircleMenuItemProps extends CircleButtonProps {
  radius?: number;
  menuActive?: boolean;
  rotationAngle?: number;
}

export const CircleMenuItem: React.FunctionComponent<CircleMenuItemProps> = ({
  size = 2,
  radius = 1,
  menuActive = false,
  rotationAngle = 0,
  ...props
}) => {
  const activeTransformStyle: string = `translateY(-50%) rotate(${rotationAngle}deg) translate(${radius}em) rotate(${-rotationAngle}deg)`;

  return (
    <CircleButton
      {...props}
      className={
        "circle-menu-item" + (props.className ? " " + props.className : "")
      }
      size={size}
      style={{ transform: menuActive ? activeTransformStyle : undefined }}
    >
      {props.children}
    </CircleButton>
  );
};

interface CircleMenuProps {
  startAngle: number;
  rotationAngle: number;
  rotationAngleInclusive?: boolean;
  radius?: number;
  itemSize?: number;
}

export const CircleMenu: React.FunctionComponent<CircleMenuProps> = ({
  rotationAngleInclusive = true,
  radius = 2,
  itemSize = 2,
  ...props
}) => {
  const [menuActive, setMenuActive] = useState<boolean>(false);

  const childrenCount = React.Children.count(props.children);
  const itemCount = rotationAngleInclusive ? childrenCount - 1 : childrenCount;

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  return (
    <div className={"circle-menu" + (menuActive ? " circle-menu-active" : "")}>
      <div className="circle-menu-backdrop" onClick={toggleMenu} />
      <CircleMenuToggle size={itemSize} toggleMenu={toggleMenu} />
      <div className="circle-menu-data">
        {React.Children.map(props.children, (child, index: number) => {
          // Calculating angle
          let angle = props.startAngle;
          let increment = 0;
          if (childrenCount > 1) {
            increment = Math.round(props.rotationAngle / itemCount);
          }
          angle += index * increment;

          return (
            <CircleMenuItem
              key={"cm-item-" + index}
              {...(child as ReactElement<CircleMenuItemProps>).props}
              size={itemSize}
              menuActive={menuActive}
              radius={radius}
              rotationAngle={angle}
            />
          );
        })}
      </div>
    </div>
  );
};

export const TestMenuComponent = () => {
  return (
    <CircleMenu
      startAngle={-90}
      rotationAngle={360}
      itemSize={2}
      radius={5}
      /**
       * rotationAngleInclusive (default true)
       * Whether to include the ending angle in rotation because an
       * item at 360deg is the same as an item at 0deg if inclusive.
       * Leave this prop for angles other than 360deg unless otherwise desired.
       */
      rotationAngleInclusive={false}
    >
      <CircleMenuItem
        onClick={() => alert("Clicked the item")}
        tooltip="Email"
        tooltipPlacement="right"
      >
        <MailIcon />
      </CircleMenuItem>
      <CircleMenuItem tooltip="Help">
        <HelpOutlineIcon />
      </CircleMenuItem>
      <CircleMenuItem tooltip="Location">
        <MapIcon />
      </CircleMenuItem>
      <CircleMenuItem tooltip="Info">
        <InfoIcon />
      </CircleMenuItem>
    </CircleMenu>
  );
};

export const PieMenu = ({ example }: { example: boolean }) => {
  return <div />;
};
