# ========================================================
#                               Analisis de Estadistica en Aplicaciones Web
#                                 Generacion de Graficos y Simulaciones
# ========================================================
# Desarrollado por: Andres Felipe Perez V. - Alejandro Usme Gallego - Jorge Mario Pineda Ricardo
# Fecha: 19 de abril de 2025
# Descripcion: Este codigo realiza un analisis de datos de ventas online,
#               generando graficos y obteniendo estadisticas descriptivas
#               para comprender el comportamiento de los precios totales
#               de una muestra de transacciones. Este analisis puede ser
#               util para entender patrones de adquisicion, comportamiento,
#               conversion y personalizacion de usuarios en aplicaciones web
#               de comercio electronico.
# ========================================================

# limpiar zona de trabajo
rm(list = ls())

# limpiar consola
cat("\014")

# limpiar zona de plots
# dev.off()

# Instalamos y cargamos las librerias necesarias
if (!require('tidyverse')) install.packages('tidyverse')
if (!require('lubridate')) install.packages('lubridate')
if (!require('ggplot2')) install.packages('ggplot2')
if (!require('dplyr')) install.packages('dplyr')
if (!require('readxl')) install.packages('readxl')
if (!require('plotly')) install.packages('plotly')
if (!require('knitr')) install.packages('knitr')
if (!require('scales')) install.packages('scales')

library(tidyverse)
library(lubridate)
library(ggplot2)
library(dplyr)
library(readxl)
library(plotly)
library(knitr)
library(scales)

# ================================
# 2. Cargar el Dataset
# ================================

# dataset <- read_excel("C:/Users/USUARIO/Desktop/Modelamiento y simulacion/Tarea/Online Retail.xlsx")
#dataset <- read_excel("C:/Users/USUARIO/Desktop/Modelamiento y simulacion/Tarea/Online Retail.xlsx")
dataset <- read_excel("D:/Itm/Simulacion de proeycto/Taller 2/Online Retail.xlsx")

dim(dataset)   # Verificar dimensiones del dataset
head(dataset)  # Mostrar primeras filas


# ================================
# 3. Exploracion y Limpieza de Datos
# ================================

# Revisar la estructura del dataset
str(dataset)

# Revisar valores nulos
colSums(is.na(dataset))

# Eliminar filas con valores nulos
dataset_limpio <- na.omit(dataset)


# Convertir InvoiceDate a formato fecha-hora
dataset_limpio$InvoiceDate <- as.POSIXct(dataset_limpio$InvoiceDate, format="%Y-%m-%d %H:%M:%S")


str(dataset_limpio$Quantity)
str(dataset_limpio$UnitPrice)


dataset_limpio$Quantity <- as.numeric(dataset_limpio$Quantity)
dataset_limpio$UnitPrice <- as.numeric(dataset_limpio$UnitPrice)


# Calcular el precio total por linea
dataset_limpio$PrecioTotal <- dataset_limpio$Quantity * dataset_limpio$UnitPrice


# Anadir columnas de tiempo para analisis
dataset_limpio$YearMonth <- format(dataset_limpio$InvoiceDate, "%Y-%m")
dataset_limpio$Date <- as.Date(dataset_limpio$InvoiceDate)
dataset_limpio$Hour <- hour(dataset_limpio$InvoiceDate)
dataset_limpio$DayOfWeek <- wday(dataset_limpio$InvoiceDate, label = TRUE)


# Identificar transacciones de cancelacion
dataset_limpio$EsCancelacion <- grepl("^C", dataset_limpio$InvoiceNo)

# Resumen estadistico
summary(dataset_limpio)

# ================================
# 4. Validacion de Campos Esenciales
# ================================

# Verificar campos esenciales
campos_esenciales <- data.frame(
  Campo = c("Identificacion de Usuarios", "Registro Temporal", "Evento Registrado", "Ubicacion del Evento"),
  Presente = c(
    !is.null(dataset_limpio$CustomerID),
    !is.null(dataset_limpio$InvoiceDate),
    !is.null(dataset_limpio$InvoiceNo),
    !is.null(dataset_limpio$Country)
  ),
  Columna_Correspondiente = c("CustomerID", "InvoiceDate", "InvoiceNo", "Country")
)

print(campos_esenciales)

# ================================
# 5. Verifica los nombres de todas las columnas
# ================================

names(dataset_limpio)


# ================================
# 5. Tomar una muestra aleatoria de 50 registros
# ================================

set.seed(123)   # Semilla para reproducibilidad
muestra <- sample(dataset_limpio$PrecioTotal, 50)



# ================================
# 6. Calculos estadisticos
# ================================

media <- mean(muestra)
mediana <- median(muestra)
rango <- range(muestra)
varianza <- var(muestra)
desviacion <- sd(muestra)
coef_variacion <- (desviacion / media) * 100


# 6.1: Mostrar los resultados
cat("----- Estadisticas Descriptivas -----\n")
cat("Media: ", media, "\n")
cat("Mediana: ", mediana, "\n")
cat("Rango: ", rango[2] - rango[1], "\n")
cat("Varianza: ", varianza, "\n")
cat("Desviacion Estandar: ", desviacion, "\n")
cat("Coeficiente de Variacion (%): ", coef_variacion, "\n")


# ================================
# 7. Visualizacion - Histograma de la Muestra
# ================================

df_muestra <- data.frame(PrecioTotal = muestra)

# Se agrega una variable de grupo para los colores
df_muestra$Grupo <- cut(df_muestra$PrecioTotal, breaks = seq(0, max(df_muestra$PrecioTotal) + 5, by = 5))

# se grafica con colores por grupo
histograma_muestra <- ggplot(df_muestra, aes(x = PrecioTotal, fill = Grupo)) +
  geom_histogram(binwidth = 5, color = "white", boundary = 0) +
  scale_fill_brewer(palette = "Set3") +   # Paleta de colores
  labs(
    title = "Distribucion del Precio Total (Muestra de 50 transacciones)",
    subtitle = "Cada barra tiene un color diferente segun el rango de precio",
    x = "Precio Total",
    y = "Frecuencia",
    fill = "Rango de Precios"
  ) +
  theme_minimal(base_size = 14) +
  theme(
    plot.title = element_text(face = "bold", size = 16, color = "#333333"),
    plot.subtitle = element_text(size = 12, color = "gray30"),
    legend.position = "right"
  )

print(histograma_muestra)

# ======================================================================
# 8. Visualizaciones Adicionales para Analisis en Aplicaciones Web
# ======================================================================

# 8.1. Grafico de Dispersion (Scatter Plot) de Cantidad vs. Precio Unitario
scatter_cantidad_precio <- ggplot(dataset_limpio, aes(x = UnitPrice, y = Quantity)) +
  geom_point() +
  labs(
    title = "Relacion entre Cantidad y Precio Unitario",
    x = "Precio Unitario",
    y = "Cantidad"
  ) +
  theme_minimal()

print(scatter_cantidad_precio)

# 8.2. Grafico de Lineas de la Evolucion del Precio Total Promedio por Mes
tendencia_precio_mensual <- dataset_limpio %>%
  group_by(YearMonth) %>%
  summarise(PrecioTotalPromedio = mean(PrecioTotal, na.rm = TRUE))

line_precio_promedio_mes <- ggplot(tendencia_precio_mensual, aes(x = YearMonth, y = PrecioTotalPromedio, group = 1)) +
  geom_line() +
  geom_point() +
  labs(
    title = "Evolucion del Precio Total Promedio por Mes",
    x = "Mes",
    y = "Precio Total Promedio"
  ) +
  theme_minimal() +
  theme(axis.text.x = element_text(angle = 45, hjust = 1))

print(line_precio_promedio_mes)

# 8.3. Grafico de Barras del Total de Ventas por Pais
ventas_por_pais <- dataset_limpio %>%
  group_by(Country) %>%
  summarise(TotalVentas = sum(PrecioTotal, na.rm = TRUE)) %>%
  arrange(desc(TotalVentas))

bar_ventas_pais <- ggplot(ventas_por_pais, aes(x = Country, y = TotalVentas)) +
  geom_bar(stat = "identity", fill = "steelblue") +
  labs(
    title = "Total de Ventas por Pais",
    x = "Pais",
    y = "Total de Ventas"
  ) +
  theme_minimal() +
  theme(axis.text.x = element_text(angle = 45, hjust = 1))

print(bar_ventas_pais)

# 8.4. Grafico de Barras del Numero de Transacciones por Dia de la Semana
transacciones_por_dia <- dataset_limpio %>%
  group_by(DayOfWeek) %>%
  summarise(NumeroTransacciones = n())

bar_transacciones_dia <- ggplot(transacciones_por_dia, aes(x = DayOfWeek, y = NumeroTransacciones)) +
  geom_bar(stat = "identity", fill = "skyblue") +
  labs(
    title = "Numero de Transacciones por Dia de la Semana",
    x = "Dia de la Semana",
    y = "Numero de Transacciones"
  ) +
  theme_minimal()

print(bar_transacciones_dia)

# 8.5. Grafico de Caja (Boxplot) del Precio Total por Dia de la Semana
boxplot_precio_dia <- ggplot(dataset_limpio, aes(x = DayOfWeek, y = PrecioTotal)) +
  geom_boxplot(fill = "lightgreen") +
  labs(
    title = "Distribucion del Precio Total por Dia de la Semana",
    x = "Dia de la Semana",
    y = "Precio Total"
  ) +
  theme_minimal()

print(boxplot_precio_dia)

# 8.6. Grafico de Barras Apiladas del Numero de Transacciones (Canceladas vs. No Canceladas) por Mes
transacciones_canceladas_por_mes <- dataset_limpio %>%
  group_by(YearMonth, EsCancelacion) %>%
  summarise(NumeroTransacciones = n())

bar_apilado_cancelaciones_mes <- ggplot(transacciones_canceladas_por_mes, aes(x = YearMonth, y = NumeroTransacciones, fill = EsCancelacion)) +
  geom_bar(stat = "identity") +
  scale_fill_manual(values = c("FALSE" = "lightcoral", "TRUE" = "darkgray"),
                    labels = c("No Cancelada", "Cancelada")) +
  labs(
    title = "Numero de Transacciones (Canceladas vs. No Canceladas) por Mes",
    x = "Mes",
    y = "Numero de Transacciones",
    fill = "Tipo de Transaccion"
  ) +
  theme_minimal() +
  theme(axis.text.x = element_text(angle = 45, hjust = 1))

print(bar_apilado_cancelaciones_mes)




# ================================
# 9. Cálculos estadísticos para el tiempos de respuesta 
# ================================

#Simulamos los datos
set.seed(123)  # para reproducibilidad
TiempoRespuesta <- round(rnorm(50, mean = 350, sd = 50), 2)
print(TiempoRespuesta)




media <- mean(TiempoRespuesta)
mediana <- median(TiempoRespuesta)
rango <- range(TiempoRespuesta)
varianza <- var(TiempoRespuesta)
desviacion <- sd(TiempoRespuesta)
coef_variacion <- (desviacion / media) * 100

# 9.1: Mostrar los resultados
cat("----- Estadísticas Descriptivas -----\n")
cat("Media: ", media, "\n")
cat("Mediana: ", mediana, "\n")
cat("Rango: ", rango[2] - rango[1], "\n")
cat("Varianza: ", varianza, "\n")
cat("Desviación Estándar: ", desviacion, "\n")
cat("Coeficiente de Variación (%): ", coef_variacion, "\n")

# ================================
# 9.2. Visualización para tiempo de respuesta
# ================================

df_tiempo <- data.frame(TiempoRespuesta = TiempoRespuesta)

# Crear una variable de grupo por rangos
df_tiempo$Grupo <- cut(
  df_tiempo$TiempoRespuesta,
  breaks = seq(floor(min(df_tiempo$TiempoRespuesta)),
               ceiling(max(df_tiempo$TiempoRespuesta)) + 10,
               by = 10)
)

# Generar el histograma con colores por grupo
ggplot(df_tiempo, aes(x = TiempoRespuesta, fill = Grupo)) +
  geom_histogram(binwidth = 10, color = "white", boundary = 0) +
  scale_fill_brewer(palette = "Set3") +
  labs(
    title = "Distribución del Tiempo de Respuesta",
    subtitle = "Agrupado por rangos de 10 unidades",
    x = "Tiempo de Respuesta (ms)",
    y = "Frecuencia",
    fill = "Rango de Tiempo"
  ) +
  theme_minimal(base_size = 14) +
  theme(
    plot.title = element_text(face = "bold", size = 16, color = "#333333"),
    plot.subtitle = element_text(size = 12, color = "gray30"),
    legend.position = "right"
  )
