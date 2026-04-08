/**
 * App.js — Punto de entrada de CieloObs
 *
 * Aquí se inicializa la base de datos y se configura
 * la navegación entre pantallas con React Navigation.
 */

import React, { useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

// Base de datos local (SQLite)
import { initDB } from './src/database'

// Tema de colores
import { COLORS } from './src/theme'

// Pantallas
import HomeScreen from './src/screens/HomeScreen'
import NewObservationScreen from './src/screens/NewObservationScreen'
import DetailScreen from './src/screens/DetailScreen'
import AboutScreen from './src/screens/AboutScreen'

// Crear el stack de navegación
const Stack = createNativeStackNavigator()

// Opciones de encabezado compartidas (estilo oscuro astronómico)
const headerStyles = {
	headerStyle: { backgroundColor: COLORS.bg },
	headerTintColor: COLORS.accent,
	headerTitleStyle: { color: COLORS.textPrimary, fontWeight: '600' },
}

export default function App() {
	// Inicializar SQLite al arrancar la app
	useEffect(() => {
		initDB()
	}, [])

	return (
		<>
			{/* Barra de estado estilo oscuro */}
			<StatusBar style='light' backgroundColor={COLORS.bg} />

			<NavigationContainer>
				<Stack.Navigator initialRouteName='Home' screenOptions={headerStyles}>
					{/* Pantalla principal: lista de observaciones */}
					<Stack.Screen
						name='Home'
						component={HomeScreen}
						options={{ headerShown: false }} // El header es personalizado en HomeScreen
					/>

					{/* Formulario de nueva observación */}
					<Stack.Screen
						name='NuevaObservacion'
						component={NewObservationScreen}
						options={{ title: 'Nueva Observación' }}
					/>

					{/* Detalle de una observación */}
					<Stack.Screen
						name='Detalle'
						component={DetailScreen}
						options={{ title: 'Detalle' }}
					/>

					{/* Perfil del observador */}
					<Stack.Screen
						name='Acerca'
						component={AboutScreen}
						options={{ title: 'Acerca de mí' }}
					/>
				</Stack.Navigator>
			</NavigationContainer>
		</>
	)
}
