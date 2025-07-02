import React, { useEffect, useState } from "react";
import { Dimensions, SafeAreaView, ScrollView, Text, View } from "react-native";
import { BarChart } from "react-native-chart-kit";

export default function ReportScreen() {
  const [labels, setLabels] = useState<string[]>([]);
  const [amounts, setAmounts] = useState<number[]>([]);

  useEffect(() => {
    fetch("http://192.168.39.192:8000/get-sales-report.php")
      .then(res => res.json())
      .then(data => {
        const report = data.report || [];
        setLabels(report.map((r: any) => r.date));
        setAmounts(report.map((r: any) => Number(r.total)));
      });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f3f4f6" }}>
      <ScrollView>
        <Text style={{
          fontSize: 26,
          fontWeight: "bold",
          marginTop: 24,
          marginBottom: 8,
          textAlign: "center",
          color: "#4f46e5"
        }}>
          Sales Report (Last 5 Days)
        </Text>
        <View
          style={{
            backgroundColor: "#fff",
            margin: 16,
            borderRadius: 20,
            padding: 16,
            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 },
            elevation: 4,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#4f46e5",
              textAlign: "center",
              marginBottom: 8,
              letterSpacing: 0.5,
            }}
          >
            Last 5 Days Checkout Amount
          </Text>
          <BarChart
            data={{
              labels: labels.length > 0 ? labels : ["-"],
              datasets: [{ data: amounts.length > 0 ? amounts : [0] }]
            }}
            width={Dimensions.get("window").width - 64}
            height={260}
            yAxisLabel=""
            yAxisSuffix=""
            fromZero
            segments={Math.max(1, Math.ceil(Math.max(...amounts, 100000) / 100000))}
            showValuesOnTopOfBars
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#e0e7ff",
              backgroundGradientTo: "#f3f4f6",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(55, 65, 81, ${opacity})`,
              style: { borderRadius: 16 },
              propsForBackgroundLines: { stroke: "#e5e7eb" },
              barPercentage: 0.6,
              fillShadowGradient: "#6366f1",
              fillShadowGradientOpacity: 1,
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16,
              alignSelf: "center"
            }}
          />
          <Text
            style={{
              textAlign: "left",
              marginLeft: 24,
              marginTop: 0,
              color: "#6b7280",
              fontSize: 13,
              fontWeight: "bold"
            }}
          >
            
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}