import os
from time import sleep

from selenium import webdriver
from selenium.webdriver.common.proxy import *
from selenium.webdriver.firefox.firefox_binary import FirefoxBinary
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
from pyvirtualdisplay import Display
import settings as st

CURRENT_DIR = os.path.dirname(os.path.realpath(__file__))
DOWNLOAD_PATH = os.path.join(CURRENT_DIR, 'chrome-downloads')


def get_chrome_options(PROXY=None):
    """Sets chrome options for Selenium.
    Chrome options for headless browser is enabled.
    """
    chrome_options = Options()
    if PROXY:
        chrome_options.add_argument('--proxy-server={}'.format(PROXY))
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("'--log-level=3'")
    chrome_prefs = {
        "download.default_directory": DOWNLOAD_PATH,
        "download.prompt_for_download": False,
        "download.directory_upgrade": True,
        "safebrowsing.enabled": True
    }
    chrome_options.experimental_options["prefs"] = chrome_prefs
    chrome_options.experimental_options["w3c"] = False
    return chrome_options


def get_driver(chrome=True, USE_PROXY=None, DISPLAY_WIDTH=2880, DISPLAY_HEIGHT=1800):
    display = Display(size=(DISPLAY_WIDTH, DISPLAY_HEIGHT))
    display.start()
    proxy = None
    if chrome:
        chrome_driver = ChromeDriverManager().install()
        driver = webdriver.Chrome(
            chrome_driver,
            chrome_options=get_chrome_options(PROXY=st.PROXY if USE_PROXY else None))
    else:
        binary = None
        caps = None
        if st.FIREFOX:
            binary = FirefoxBinary(st.FIREFOX)
            caps = DesiredCapabilities.FIREFOX.copy()
            caps['marionette'] = True

        profile = webdriver.FirefoxProfile()
        profile.set_preference('browser.download.folderList', 2)  # custom location
        profile.set_preference('browser.download.manager.showWhenStarting', False)
        profile.set_preference('browser.download.dir', os.path.join(CURRENT_DIR, 'downloads'))
        profile.set_preference('browser.helperApps.neverAsk.saveToDisk',
                               "text/plain, application/vnd.ms-excel, text/csv, text/comma-separated-values, application/octet-stream")

        driver_path = os.path.join(CURRENT_DIR, 'drivers', 'geckodriver')

        if USE_PROXY:
            proxy = Proxy({
                'proxyType': ProxyType.MANUAL,
                'httpProxy': USE_PROXY,
                'ftpProxy': USE_PROXY,
                'sslProxy': USE_PROXY,
                'noProxy': ''})

        driver = webdriver.Firefox(
            firefox_binary=binary,
            firefox_profile=profile,
            executable_path=driver_path,
            proxy=proxy,
            capabilities=caps)

    return display, driver


def close_driver(display, driver):
    driver.quit()
    if display:
        display.stop()


def click_element(driver, element):
    driver.execute_script("arguments[0].click();", element)


def wait_xpath(driver, condition, selector=By.XPATH, timeout=580):
    WebDriverWait(driver, timeout, 1).until(EC.presence_of_element_located((selector, condition)))


def select_frame_by_text(driver, text: str = ''):
    for index, iframe in enumerate(driver.find_elements_by_tag_name('iframe')):
        sleep(1)
        WebDriverWait(driver, 10).until(EC.frame_to_be_available_and_switch_to_it(index))
        if text in driver.page_source:
            return


def frame_search(driver, path, callback):
    framedict = {}
    for child_frame in driver.find_elements_by_tag_name('frame'):
        child_frame_name = child_frame.get_attribute('name')
        framedict[child_frame_name] = {'framepath' : path, 'children': {}}
        xpath = '//frame[@name="{}"]'.format(child_frame_name)
        driver.switch_to.frame(driver.find_element_by_xpath(xpath))
        framedict[child_frame_name]['children'] = frame_search(framedict[child_frame_name]['framepath']+[child_frame_name])
        callback(driver)
        driver.switch_to.default_content()
        if len(framedict[child_frame_name]['framepath'])>0:
            for parent in framedict[child_frame_name]['framepath']:
                parent_xpath = '//frame[@name="{}"]'.format(parent)
                driver.switch_to.frame(driver.find_element_by_xpath(parent_xpath))
    return framedict


if __name__ == "__main__":
    driver = get_driver()