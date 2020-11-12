#!/usr/bin/python
# -*- coding: UTF-8 -*-
import sys  
  
reload(sys)  
sys.setdefaultencoding('utf8')   

import requests

r0 = requests.get("https://www.baidu.com/")
print r0.text