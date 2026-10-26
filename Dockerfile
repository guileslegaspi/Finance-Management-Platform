FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["Finance Management Platform.csproj", "./"]
RUN dotnet restore "Finance Management Platform.csproj"

COPY . .
RUN dotnet publish "Finance Management Platform.csproj" \
    -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Finance Management Platform.dll"]