import React from "react";
import { Svg, Path } from "react-native-svg";

type IconProps = {
  size: number;
  color?: string;
};

export default function VolumeHighIcon(props: IconProps) {
  return (
    <Svg viewBox="0 0 1024 1024" width={props.size} height={props.size}>
      <Path
        d="M315.861333 245.546667c83.328-100.053333 97.408-112.896 145.493334-95.488l4.266666 1.578666c41.216 16 45.909333 35.968 46.336 142.464v435.797334c-0.426667 110.037333-5.418667 127.658667-50.602666 144.042666l-4.437334 1.536c-41.728 13.994667-58.154667 1.706667-126.250666-79.274666l-97.834667-117.333334-64.085333-12.8a106.666667 106.666667 0 0 1-66.133334-42.922666l-4.437333-6.826667a203.264 203.264 0 0 1-5.461333-198.954667l5.461333-9.685333a106.666667 106.666667 0 0 1 70.570667-49.749333l64.085333-12.842667z m553.002667-5.077334a384 384 0 0 1 2.133333 540.928 42.666667 42.666667 0 1 1-60.8-59.861333 298.666667 298.666667 0 0 0-1.706666-420.693333 42.666667 42.666667 0 1 1 60.373333-60.373334z m-443.178667 7.978667l-11.52 12.885333c-3.413333 3.925333-7.253333 8.448-11.648 13.653334L293.12 406.101333a61.866667 61.866667 0 0 1-35.413333 21.077334l-72.234667 14.421333a20.906667 20.906667 0 0 0-13.482667 8.832l-4.181333 7.424c-18.773333 36.138667-17.493333 79.530667 3.541333 114.56a21.333333 21.333333 0 0 0 14.122667 9.984l72.277333 14.421333c13.824 2.773333 26.325333 10.24 35.370667 21.077334l94.250667 113.066666c11.434667 13.696 20.010667 23.850667 26.837333 31.701334l11.477333 12.842666 0.554667-13.482666c0.128-5.461333 0.256-11.776 0.298667-19.2L426.666667 298.666667c0-13.610667-0.128-24.277333-0.298667-32.938667l-0.64-17.28z m267.349334 82.517333a256 256 0 0 1 1.408 360.618667 42.666667 42.666667 0 0 1-60.8-59.861333 170.666667 170.666667 0 0 0-0.981334-240.384 42.666667 42.666667 0 1 1 60.373334-60.373334z"
        fill={props.color || "#2c2c2c"}
      />
    </Svg>
  );
}