import os
from django.urls import re_path
from channels.routing import ProtocolTypeRouter
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

from websocket.realtime import RealTimeConsumer
from websocket.active import ActiveConsumer
from websocket.alerts import AlertConsumer

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'WAsP.settings')

django_asgi_app = get_asgi_application()

websocket_routing = [
    re_path(r'socket/realtime/(\d+)$', RealTimeConsumer.as_asgi()),
    re_path(r'socket/active/$', ActiveConsumer.as_asgi()),
    re_path(r'socket/alert/(\d+)$', AlertConsumer.as_asgi()),
]

application = ProtocolTypeRouter({
    #"http": django_asgi_app,
    'websocket': AuthMiddlewareStack(
        URLRouter(
            websocket_routing
        )
    ),
})