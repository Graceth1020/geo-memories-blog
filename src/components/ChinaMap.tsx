import { useEffect, useMemo, useRef } from "react";
import * as echarts from "echarts/core";
import { MapChart } from "echarts/charts";
import { TooltipComponent, GeoComponent, VisualMapComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import chinaJson from "@/assets/china.json";

echarts.use([MapChart, TooltipComponent, GeoComponent, VisualMapComponent, CanvasRenderer]);

let registered = false;
function ensureMap() {
  if (!registered) {
    echarts.registerMap("china", chinaJson as any);
    registered = true;
  }
}

interface Props {
  visited: string[];
  postCounts: Record<string, number>;
  onSelect?: (province: string) => void;
}

const ChinaMap = ({ visited, postCounts, onSelect }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);

  // Match province names with/without 省/市/自治区 suffix
  const matchName = (full: string) => {
    return visited.find(
      (v) => full.includes(v) || v.includes(full.replace(/(省|市|自治区|特别行政区|维吾尔|回族|壮族|)$/g, ""))
    );
  };

  const option = useMemo(() => {
    const data = (chinaJson as any).features.map((f: any) => {
      const name = f.properties.name;
      const matched = matchName(name);
      return {
        name,
        value: matched ? postCounts[matched] ?? 1 : 0,
        province: matched,
      };
    });
    return {
      tooltip: {
        trigger: "item",
        backgroundColor: "hsl(38, 45%, 95%)",
        borderColor: "hsl(12, 55%, 38%)",
        borderWidth: 1,
        textStyle: { color: "hsl(25, 40%, 15%)", fontFamily: "Noto Serif SC, serif" },
        formatter: (p: any) => {
          const count = p.data?.value ?? 0;
          if (count > 0) return `<b>${p.name}</b><br/>足迹：${count} 篇`;
          return `${p.name}<br/><i style="opacity:.6">尚未到访</i>`;
        },
      },
      visualMap: { show: false, min: 0, max: 5,
        inRange: { color: ["hsl(35, 25%, 78%)", "hsl(28, 65%, 55%)", "hsl(12, 55%, 38%)"] } },
      series: [
        {
          name: "足迹",
          type: "map",
          map: "china",
          roam: false,
          zoom: 1.2,
          label: {
            show: false,
          },
          emphasis: {
            label: { show: true, color: "hsl(38, 45%, 95%)", fontFamily: "Noto Serif SC, serif", fontWeight: 600 },
            itemStyle: {
              areaColor: "hsl(355, 60%, 42%)",
              borderColor: "hsl(25, 40%, 15%)",
              shadowBlur: 12,
              shadowColor: "hsl(25, 40%, 15%, 0.3)",
            },
          },
          itemStyle: {
            borderColor: "hsl(25, 30%, 35%)",
            borderWidth: 0.6,
            areaColor: "hsl(36, 35%, 86%)",
          },
          data,
        },
      ],
    } as any;
  }, [visited, postCounts]);

  useEffect(() => {
    if (!ref.current) return;
    ensureMap();
    const chart = echarts.init(ref.current);
    chartRef.current = chart;
    chart.setOption(option);
    const handler = (params: any) => {
      const prov = params.data?.province;
      if (prov && onSelect) onSelect(prov);
    };
    chart.on("click", handler);
    const onResize = () => chart.resize();
    window.addEventListener("resize", onResize);
    return () => {
      chart.off("click", handler);
      window.removeEventListener("resize", onResize);
      chart.dispose();
    };
  }, [option, onSelect]);

  return (
    <div className="relative grain w-full h-[420px] md:h-[560px]">
      <div ref={ref} className="w-full h-full" />
    </div>
  );
};

export default ChinaMap;
