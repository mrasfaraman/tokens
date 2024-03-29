import React from 'react';
import { View, Dimensions } from 'react-native';
import { LineChart } from 'react-native-svg-charts';

const Sparkline = ({ data }) => {
  const previous24HoursData = data.slice(-24);

  const change = previous24HoursData.length > 1 ? previous24HoursData[23] - previous24HoursData[0] : 0;
  
  const strokeColor = change < 0 ? 'red' : 'green';

  const screenWidth = Dimensions.get('window').width;

  return (
    <View>
      <LineChart
        style={{ height: 50, width: 80 }}
        data={data}
        svg={{ stroke: strokeColor, strokeWidth: 2 }}
        contentInset={{ top: 0, bottom: 0 }}
      />
    </View>
  );
};

export default Sparkline;
