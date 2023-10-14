// ** React Imports
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

// ** Utils
import { priceFormatter } from '@utils';

const CustomTooltip = (data) => {
  if (data.active && data.payload) {
    return (
      <div className="recharts-custom-tooltip">
        <p className="font-weight-bold mb-0">{data.label}</p>
        <hr />
        <div className="active">
          {data.payload.map((i) => (
            <div className="d-flex align-items-center" key={i.dataKey}>
              <span
                className="bullet  bullet-sm bullet-bordered mr-50"
                style={{
                  backgroundColor: i.fill,
                }}
              />
              <span className="align-middle text-capitalize mr-75">
                {i.dataKey}
                :
                {' '}
                {i.dataKey === 'revenue' ? priceFormatter(i.payload[i.dataKey]) : i.payload[i.dataKey]}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

const SimpleBarChart = (props) => {
  const { data, type } = props;
  return (
    <div className="recharts-wrapper bar-chart">
      <ResponsiveContainer>
        <BarChart height={300} data={data} barSize={20}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip content={CustomTooltip} />
          <Bar dataKey={type} stackId="a" fill="#7f3f98" radius={[10, 10, 0, 0]} />
          {/* <Bar dataKey="samsung" stackId="a" fill="#9f87ff" /> */}
          {/* <Bar dataKey="oneplus" stackId="a" fill="#d2b0ff" /> */}
          {/* <Bar dataKey="motorola" stackId="a" fill="#f8d3ff" /> */}
        </BarChart>
      </ResponsiveContainer>
    </div>

  );
};
export default SimpleBarChart;
