import pandas as pd
import json
from datetime import datetime
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
        "current_date": ["current_date", "日期"],
        "actual_profit": ["actual_profit", "实际收益"]  # 新增实际收益映射
    }
    
    reverse_map = {}
    for col in df.columns:
        lower_col = col.strip().lower()
        for key, aliases in column_map.items():
            if any(alias.lower() == lower_col for alias in aliases):
                reverse_map[col] = key
                break
    
    df = df.rename(columns=reverse_map)
    
    # 处理缺失的actual_profit列
    if "actual_profit" not in df.columns:
        df["actual_profit"] = 0.0
    
    required_cols = ["current_app", "current_price", "current_date"]
    if not all(col in df.columns for col in required_cols):
        return pd.DataFrame()
    
    try:
        df["current_price"] = pd.to_numeric(df["current_price"], errors="coerce")
        df["actual_profit"] = pd.to_numeric(df["actual_profit"], errors="coerce").fillna(0)  # 转换实际收益
        df["current_date"] = pd.to_datetime(df["current_date"]).dt.strftime("%Y-%m-%d")
    except Exception as e:
        print(f"类型转换错误: {str(e)}")
        return pd.DataFrame()
    
    return df[df["current_date"] == target_date]

def aggregate_data(sheets):
    """增强版数据聚合：包含金额和收益"""
    totals = {}
    
    for sheet_name, df in sheets.items():
        processed_df = process_sheet(df.copy(), TARGET_DATE)
        if processed_df.empty:
            continue
        
        # 确定分类名称
        if "理财" in sheet_name:
            category = "美元理财" if "美元" in sheet_name else "人民币理财"
        else:
            category = sheet_name
        
        # 分组聚合
        grouped = processed_df.groupby("current_app").agg({
            "current_price": "sum",
            "actual_profit": "sum"
        }).round(2)
        
        # 累加数据
        for app, row in grouped.iterrows():
            amount = row["current_price"]
            profit = row["actual_profit"]
            
            # 存储金额
            totals.setdefault(app, {}).setdefault(category, 0.0)
            totals[app][category] += amount
            
            # 存储收益（使用_category_收益格式）
            profit_key = f"{category}_收益"
            totals.setdefault(app, {}).setdefault(profit_key, 0.0)
            totals[app][profit_key] += profit
    
    return totals

def save_to_json(data, filename):
    """保存包含收益的增强版JSON"""
    formatted_data = {}
    grand_total = 0.0
    grand_total_profit = 0.0
    
    for app, categories in data.items():
        detail = {}
        total = 0.0
        total_profit = 0.0
        
        # 分离金额和收益
        for key, value in categories.items():
            if key.endswith("_收益"):
                detail[key] = round(value, 2)
                total_profit += value
            else:
                detail[key] = round(value, 2)
                total += value
        
        formatted_data[app] = {
            "detail": detail,
            "total": round(total, 2),
            "total_profit": round(total_profit, 2)
        }
        
        grand_total += total
        grand_total_profit += total_profit
    
    formatted_data["grand_total"] = round(grand_total, 2)
    formatted_data["grand_total_profit"] = round(grand_total_profit, 2)
    
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(formatted_data, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    if not os.path.exists(FILE_PATH):
        print(f"错误：文件 {FILE_PATH} 不存在")
        exit(1)
        
    sheets = load_sheets(FILE_PATH)
    app_totals = aggregate_data(sheets)
    save_to_json(app_totals, OUTPUT_JSON)
    
    print("增强版统计结果（含收益）：")
    print(json.dumps(app_totals, indent=2, ensure_ascii=False))
    # print(f"\n当日总金额：￥{formatted_data['grand_total']:,.2f}")
    # print(f"当日总收益：￥{formatted_data['grand_total_profit']:,.2f}")