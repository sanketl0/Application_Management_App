from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CandidateViewSet, login_view, logout_view

# Create a router and register our viewset
router = DefaultRouter()
router.register(r'candidates', CandidateViewSet, basename='candidate')

urlpatterns = [
    # Auth endpoints
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    
    # Include all candidate endpoints from router
    path('', include(router.urls)),
]