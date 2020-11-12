# import subprocess
# subprocess.call(["open", "-a", "electron_camera"])

import subprocess
import os

def run():
  r,w = os.pipe()
  r2,w2 = os.pipe()
  filename = r'/Applications/electron_camera.app/Contents/MacOS/electron_camera'
  # filename = r'C:\Users\zoufeng.ANTU\Desktop\test.exe'
  p =subprocess.Popen(filename,stdin=r2,stdout=w)
  w2 = os.fdopen(w2,"wb",0)
  
  r = os.fdopen(r,"rb",0)
  # print(r.readline())
  w2.write(b'1\r\n')
  print(r.readline())
  w2.write(b'2\r\n')
  print(r.readline())
  w2.write(b'3\r\n')
  print(r.readline())

  p.terminate()
  print(p.returncode)
  print('over')

if __name__ =="__main__":
  run()

  