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
  /** province -> array of city names visited in that province */
  citiesByProvince: Record<string, string[]>;
  onSelect?: (province: string) => void;
}

const stripSuffix = (s: string) =>
  s.replace(/(省|市|自治区|特别行政区|维吾尔|回族|壮族|)$/g, "");

const ChinaMap = ({ citiesByProvince, onSelect }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  const visited = useMemo(() => Object.keys(citiesByProvince), [citiesByProvince]);

  const matchProvince = (geoName: string) => {
    const stripped = stripSuffix(geoName);
    return visited.find((v) => geoName.includes(v) || v.includes(stripped));
  };

  const maxCities = useMemo(
    () => Math.max(1, ...Object.values(citiesByProvince).map((c) => c.length)),
    [citiesByProvince]
  );

  const option = useMemo(() => {
    const features = (chinaJson as any).features as any[];

    const data = features.map((f) => {
      const name = f.properties.name;
      const matched = matchProvince(name);
      const cities = matched ? citiesByProvince[matched] : [];
      return {
        name,
        value: cities.length,
        province: matched,
        cities,
      };
    });

    // Markers (city labels) at each visited province's centroid
    const markerData = features
      .map((f) => {
        const name = f.properties.name;
        const matched = matchProvince(name);
        if (!matched) return null;
        const cities = citiesByProvince[matched] ?? [];
        if (cities.length === 0) return null;
        const center = f.properties.center ?? f.properties.centroid;
        if (!center) return null;
        return {
          name: cities.join(" · "),
          value: center,
        };
      })
      .filter(Boolean) as { name: string; value: number[] }[];

    return {
      tooltip: {
        trigger: "item",
        backgroundColor: "hsl(38, 45%, 95%)",
        borderColor: "hsl(12, 55%, 38%)",
        borderWidth: 1,
        textStyle: { color: "hsl(25, 40%, 15%)", fontFamily: "Noto Serif SC, serif" },
        formatter: (p: any) => {
          const cities: string[] = p.data?.cities ?? [];
          if (cities.length > 0) {
            return `<b>${p.name}</b><br/>已抵达 ${cities.length} 城<br/><i style="opacity:.7">${cities.join("、")}</i>`;
          }
          return `${p.name}<br/><i style="opacity:.6">尚未到访</i>`;
        },
      },
      visualMap: {
        show: false,
        min: 0,
        max: maxCities,
        inRange: {
          color: [
            "hsl(36, 35%, 86%)",  // 未到访 / 0
            "hsl(32, 50%, 70%)",
            "hsl(28, 60%, 55%)",
            "hsl(18, 60%, 45%)",
            "hsl(12, 65%, 32%)",  // 城市最多
          ],
        },
      },
      geo: {
        map: "china",
        zoom: 1.2,
        silent: true,
        itemStyle: { areaColor: "transparent", borderColor: "transparent" },
      },
      series: [
        {
          name: "足迹",
          type: "map",
          map: "china",
          roam: false,
          zoom: 1.2,
          label: { show: false },
          emphasis: {
            label: { show: false },
            itemStyle: {
              areaColor: "hsl(355, 60%, 42%)",
              borderColor: "hsl(25, 40%, 15%)",
              shadowBlur: 12,
              shadowColor: "hsl(25, 40%, 15%, 0.3)",
            },
          },
          select: { disabled: true },
          itemStyle: {
            borderColor: "hsl(25, 30%, 35%)",
            borderWidth: 0.6,
            areaColor: "hsl(36, 35%, 86%)",
          },
          data,
        },
        {
          // City labels overlay
          type: "scatter",
          coordinateSystem: "geo",
          symbol: "pin",
          symbolSize: 0,
          silent: true,
          z: 5,
          label: {
            show: true,
            position: "inside",
            formatter: (p: any) => p.name,
            color: "hsl(25, 40%, 12%)",
            fontFamily: "Noto Serif SC, serif",
            fontWeight: 600,
            fontSize: 11,
            backgroundColor: "hsl(38, 45%, 95%, 0.85)",
            padding: [3, 6],
            borderRadius: 2,
            borderColor: "hsl(12, 55%, 38%)",
            borderWidth: 1,
          },
          data: markerData,
        },
      ],
    } as any;
  }, [citiesByProvince, maxCities]);

  useEffect(() => {
    if (!ref.current) return;
    ensureMap();
    const chart = echarts.init(ref.current);
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
