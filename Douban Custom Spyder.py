import time
import random

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager

def CustomSpyder() :
    # Driver Configration
    url = "https://movie.douban.com/review/best/"  ##爬取网址
    chrome_path = r"WebDriver/chrome-win64/chrome-win64/chrome.exe"  ##Webdriver 使用的chorme 地址
    driver_path = r"WebDriver/chrome-win64/chrome-win64/chromedriver.exe"  # 驱动路径

    options = Options()
    options.binary_location = chrome_path

    service = Service(executable_path=driver_path)
    driver = webdriver.Chrome(service=service, options=options)
    driver.get(url)
    # driver.maximize_window()

    readPage = 10
    all_reviews = []

    for i in range(0, readPage):
        print(f"\n 正在爬取第 {i + 1} 页")
        movie_elements = driver.find_elements(By.CLASS_NAME, "main-bd")

        for block in movie_elements:
            try:
                expandButton = block.find_element(By.CLASS_NAME, "unfold")
                # expandButton.click()
                driver.execute_script("arguments[0].click();", expandButton)
                time.sleep(2)
            except:
                pass
            try:
                title_element = block.find_element(By.TAG_NAME, "a")
                title = title_element.text.strip()
            except:
                title = "N/A"
            try:
                comment = block.find_element(By.CLASS_NAME, "short-content").text.strip().replace("\n", "")

            except:
                comment = "N/A"

            all_reviews.append({
                "title": title,
                "comment": comment
            })

        try:
            nextButtoon = button = driver.find_element(By.CLASS_NAME, "next")
            nextButtoon.click()
            time.sleep(random.uniform(1, 3))  # 行为模拟

        except:
            print("No more reviews")
            break

    return all_reviews


#End Part
# input("Press Enter to close browser...")
# driver.quit()
