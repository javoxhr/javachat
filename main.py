import asyncio
import websockets
import requests

all_clients = set()

async def send_message(message: str):
    clients_copy = all_clients.copy()
    for client in clients_copy:
        try:
            await client.send(message)
        except websockets.exceptions.ConnectionClosedOK:
            print("Connection with client closed:", client.remote_address)
            all_clients.remove(client)
        except Exception as e:
            print(f"Error sending message to client {client.remote_address}: {e}")

async def new_client_connected(client_socket: websockets.WebSocketClientProtocol, path: str):
    print("New client connected:", client_socket.remote_address)
    all_clients.add(client_socket)

    try:
        while True:
            data = await client_socket.recv()
            print("New message from client", client_socket.remote_address, ":", data)
            await send_message(data)
    except Exception as e:
        print(f"Error with client {client_socket.remote_address}: {e}")
        all_clients.remove(client_socket)

async def start_server():
    # Получаем публичный IP-адрес
    response = requests.get('https://api.ipify.org?format=json')
    public_ip = response.json()['ip']
    print("Server public IP address:", public_ip)

    # Запускаем сервер на публичном IP-адресе
    await websockets.serve(new_client_connected, '192.168.100.11' , 7815)

if __name__ == '__main__':
    event_loop = asyncio.new_event_loop()
    asyncio.set_event_loop(event_loop)
    event_loop.run_until_complete(start_server())
    event_loop.run_forever()
