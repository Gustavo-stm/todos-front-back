from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('read/filter', views.filtering),
    path('read', views.getTodos),
    path('create', views.createTodo)
]