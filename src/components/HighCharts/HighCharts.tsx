import exportingInit from 'highcharts/modules/exporting'
import offlineExporting from 'highcharts/modules/offline-exporting'
import Highcharts, {Chart} from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

import { useRef } from 'react'

if(typeof Highcharts === 'object'){
    exportingInit(Highcharts)
    offlineExporting(Highcharts)
}



type ControlledHighChartsProps = {
    options: any
}

const ControlledHighCharts: React.FC<ControlledHighChartsProps> = ({
     options
}) => {
    const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
    return (
        <>
            <HighchartsReact
            highcharts={Chart}
            options={options}
            redraw={true}
            ref={chartComponentRef}
            />
        </>
    )
}

export default ControlledHighCharts