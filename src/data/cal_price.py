import pandas as pd
import json
from datetime import datetime

# 配置参数
import os
FILE_PATH = os.path.join(os.path.dirname(__file__), "personal_page.xlsx")
TARGET_DATE = datetime.now().strftime("%Y-%m-%d")
OUTPUT_JSON = os.path.join(os.path.dirname(__file__), f"app_totals_{TARGET_DATE}.json")

def load_sheets(file_path):
    """读取Excel所有工作表并保留原始列名"""
    return pd.read_excel(file_path, sheet_name=None, dtype=str)

def process_sheet(df, target_date):
    """处理单个工作表的标准化流程"""
    column_map = {
        "current_app": ["current_app", "对应APP"],
        "current_price": ["current_price", "当前RMB数额"],
        "current_date": ["current_date", "日期"]
    }
    reverse_map = {}
    for col in df.columns:
        lower_col = col.strip().lower()
        for key, aliases in column_map.items():
            if any(alias.lower() == lower_col for alias in aliases):
                reverse_map[col] = key
                break
    df = df.rename(columns=reverse_map)
    required_cols = ["current_app", "current_price", "current_date"]
    if not all(col in df.columns for col in required_cols):
        return pd.DataFrame()
    try:
        df["current_price"] = pd.to_numeric(df["current_price"], errors="coerce")
        df["current_date"] = pd.to_datetime(df["current_date"]).dt.strftime("%Y-%m-%d")
    except Exception as e:
        print(f"类型转换错误: {str(e)}")
        return pd.DataFrame()
    return df[df["current_date"] == target_date]

def aggregate_data(sheets):
    """增强版数据聚合：所有应用按工作表分类"""
    totals = {}
    for sheet_name, df in sheets.items():
        processed_df = process_sheet(df.copy(), TARGET_DATE)
        if processed_df.empty:
            continue
        grouped = processed_df.groupby("current_app")["current_price"].sum().round(2)
        for app, amount in grouped.items():
            # 根据工作表名称确定分类
            if "理财" in sheet_name:
                category = "美元理财" if "美元" in sheet_name else "人民币理财"
            else:
                category = sheet_name
            totals.setdefault(app, {}).setdefault(category, 0)
            totals[app][category] += amount
    return totals

def save_to_json(data, filename):
    """保存增强版JSON：所有应用含明细和总计"""
    formatted_data = {}
    for app, categories in data.items():
        total = sum(categories.values())
        formatted_data[app] = {
            "detail": {k: round(v, 2) for k, v in categories.items()},
            "total": round(total, 2)
        }
    total_all = sum(app_info['total'] for app_info in formatted_data.values())
    formatted_data['grand_total'] = round(total_all, 2)
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(formatted_data, f, ensure_ascii=False, indent=2)

# 新增总金额计算
def calculate_total(json_path):
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        total = data['grand_total']
        return f"当日总金额：￥{total:,.2f}"
    except Exception as e:
        return f"计算总金额时出错：{str(e)}"

if __name__ == "__main__":
    if not os.path.exists(FILE_PATH):
        print(f"错误：文件 {FILE_PATH} 不存在")
        exit(1)
    sheets = load_sheets(FILE_PATH)
    app_totals = aggregate_data(sheets)
    save_to_json(app_totals, OUTPUT_JSON)
    print("增强版统计结果：")
    print(json.dumps(app_totals, indent=2, ensure_ascii=False))
    print("\n" + calculate_total(OUTPUT_JSON))