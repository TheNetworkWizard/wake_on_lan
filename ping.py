import os
print(os.system(f"ping -c 1 192.168.1.10  &> /dev/null") == False)
