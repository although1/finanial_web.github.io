import { FinancialData } from './dataTypes';

// These are sample data files based on the data provided
export const mockData: { data: FinancialData; date: string }[] = [
  {
    date: '2023-09-15',
    data: {
      "工商银行": {
        "detail": {
          "美元理财": 90756.71,
          "存款": 5690.4,
          "基金": 30101.12
        },
        "total": 126548.23
      },
      "招商银行": {
        "detail": {
          "美元理财": 22418.04,
          "人民币理财": 20252.5,
          "养老金": 12002.79
        },
        "total": 54673.33
      },
      "网商银行": {
        "detail": {
          "人民币理财": 70045.95,
          "存款": 10.0
        },
        "total": 70055.95
      },
      "支付宝": {
        "detail": {
          "存款": 5098.39,
          "基金": 17574.36,
          "养老金": 3089.0
        },
        "total": 25761.75
      },
      "腾讯自选股": {
        "detail": {
          "股票": 26713.96
        },
        "total": 26713.96
      },
      "grand_total": 303753.22
    }
  },
  {
    date: '2023-09-16',
    data: {
      "工商银行": {
        "detail": {
          "美元理财": 90779.09,
          "存款": 5586.6,
          "基金": 30102.34
        },
        "total": 126468.03
      },
      "招商银行": {
        "detail": {
          "美元理财": 22438.52,
          "人民币理财": 20252.5,
          "养老金": 12002.79
        },
        "total": 54693.81
      },
      "网商银行": {
        "detail": {
          "人民币理财": 70050.14
        },
        "total": 70050.14
      },
      "支付宝": {
        "detail": {
          "存款": 5098.39,
          "基金": 17789.02,
          "养老金": 3090.0
        },
        "total": 25977.41
      },
      "腾讯自选股": {
        "detail": {
          "股票": 26830.39
        },
        "total": 26830.39
      },
      "grand_total": 304019.78
    }
  }
];

// Add more mock data points to simulate trend over time
// This would typically come from loading multiple JSON files
for (let i = 0; i < 5; i++) {
  const previousData = { ...JSON.parse(JSON.stringify(mockData[mockData.length - 1])) };
  const randomChange = Math.random() * 2000 - 1000; // Random change between -1000 and +1000
  const nextDate = new Date(previousData.date);
  nextDate.setDate(nextDate.getDate() + 1);
  
  // Update the grand total
  previousData.data.grand_total += randomChange;
  previousData.data.grand_total = parseFloat(previousData.data.grand_total.toFixed(2));
  
  // Update the date
  previousData.date = nextDate.toISOString().split('T')[0];
  
  // Distribute the change across institutions
  const institutions = Object.keys(previousData.data).filter(key => key !== 'grand_total');
  const changePerInstitution = randomChange / institutions.length;
  
  institutions.forEach(institution => {
    if (typeof previousData.data[institution] === 'object') {
      const institutionData = previousData.data[institution] as any;
      institutionData.total += changePerInstitution;
      institutionData.total = parseFloat(institutionData.total.toFixed(2));
      
      // Update some random detail categories
      const details = Object.keys(institutionData.detail);
      if (details.length > 0) {
        const randomDetailIndex = Math.floor(Math.random() * details.length);
        const randomDetail = details[randomDetailIndex];
        institutionData.detail[randomDetail] += changePerInstitution;
        institutionData.detail[randomDetail] = parseFloat(institutionData.detail[randomDetail].toFixed(2));
      }
    }
  });
  
  mockData.push(previousData);
}