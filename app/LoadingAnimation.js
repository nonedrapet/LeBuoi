import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";

const Loader = () => {
  return (
    <View style={styles.wrapper}>
      <Svg
        style={{
          left: "50%",
          top: "50%",
          position: "absolute",
          transform: [
            { translateX: -200 }, // Thay đổi 200 theo chiều ngang của bạn
            { translateY: -150 }, // Thay đổi 150 theo chiều dọc của bạn
          ],
        }}
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 187.3 93.7"
        height="300px"
        width="400px"
      >
        <Path
          d="M93.9,46.4c9.3,9.5,13.8,17.9,23.5,17.9s17.5-7.8,17.5-17.5s-7.8-17.6-17.5-17.5c-9.7,0.1-13.3,7.2-22.1,17.1 
          c-8.9,8.8-15.7,17.9-25.4,17.9s-17.5-7.8-17.5-17.5s7.8-17.5,17.5-17.5S86.2,38.6,93.9,46.4z"
          strokeMiterlimit={10}
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth={4}
          fill="none"
          id="outline"
          stroke="#4E4FEB"
          strokeDasharray="2.42777px, 242.77666px"
          strokeDashoffset={0}
          style={{ animation: "anim 1.6s linear infinite" }}
        />
        <Path
          d="M93.9,46.4c9.3,9.5,13.8,17.9,23.5,17.9s17.5-7.8,17.5-17.5s-7.8-17.6-17.5-17.5c-9.7,0.1-13.3,7.2-22.1,17.1 
          c-8.9,8.8-15.7,17.9-25.4,17.9s-17.5-7.8-17.5-17.5s7.8-17.5,17.5-17.5S86.2,38.6,93.9,46.4z"
          strokeMiterlimit={10}
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth={4}
          stroke="#4E4FEB"
          fill="none"
          opacity="0.05"
          id="outline-bg"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Loader;
