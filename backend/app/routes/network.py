from fastapi import APIRouter
import subprocess
import socket
import platform
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor

router = APIRouter()

def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except:
        return "0.0.0.0"

def get_all_ips():
    import netifaces
    ips = []
    for iface in netifaces.interfaces():
        try:
            addrs = netifaces.ifaddresses(iface)
            if netifaces.AF_INET in addrs:
                for addr in addrs[netifaces.AF_INET]:
                    ip = addr['addr']
                    if not ip.startswith('127'):
                        ips.append(ip)
        except:
            pass
    return ips

def ping_device(ip):
    try:
        result = subprocess.run(
            ["ping", "-c", "1", "-W", "1", ip],
            capture_output=True, timeout=2
        )
        return result.returncode == 0
    except:
        return False

def get_hostname(ip):
    try:
        return socket.gethostbyaddr(ip)[0]
    except:
        return "Unknown Device"

def guess_device_type(hostname, ip):
    hostname = hostname.lower()
    if any(x in hostname for x in ['phone','android','samsung','xiaomi','oneplus','oppo','vivo','redmi']):
        return "📱", "Android Phone"
    elif any(x in hostname for x in ['iphone','ipad','apple']):
        return "📱", "Apple Device"
    elif any(x in hostname for x in ['laptop','desktop','pc','computer','windows','win','dell','hp','lenovo','acer','asus']):
        return "💻", "Computer"
    elif any(x in hostname for x in ['tv','smart','roku','fire']):
        return "📺", "Smart TV"
    elif any(x in hostname for x in ['router','gateway','modem']):
        return "🌐", "Router"
    else:
        return "🔌", "Device"

def scan_ip(args):
    ip, local_ips = args
    if ping_device(ip):
        hostname = get_hostname(ip)
        icon, device_type = guess_device_type(hostname, ip)
        return {
            "ip": ip,
            "hostname": hostname,
            "device_type": device_type,
            "icon": icon,
            "is_self": ip in local_ips,
            "status": "online"
        }
    return None

@router.get("/network/scan")
async def scan_network():
    local_ips = get_all_ips()
    
    # Get all network ranges to scan
    ranges = set()
    for ip in local_ips:
        parts = ip.split('.')
        ranges.add(f"{parts[0]}.{parts[1]}.{parts[2]}")
    
    # Generate all IPs
    all_ips = []
    for base in ranges:
        for i in range(1, 255):
            all_ips.append((f"{base}.{i}", local_ips))
    
    # Scan using threads
    devices = []
    with ThreadPoolExecutor(max_workers=100) as executor:
        results = list(executor.map(scan_ip, all_ips))
    
    devices = [r for r in results if r is not None]
    devices.sort(key=lambda x: x['ip'])
    
    return {
        "devices": devices,
        "total": len(devices),
        "local_ips": local_ips,
        "networks": list(ranges),
        "scan_time": datetime.now().isoformat(),
    }

@router.get("/network/myip")
async def my_ip():
    local_ips = get_all_ips()
    return {"ips": local_ips}
