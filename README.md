# Desafio: Conversor de Moedas

Aplicativo desenvolvido em **React Native (Expo)** consumindo a **ExchangeRate-API** conforme as instruções da disciplina.

## Estrutura do Aplicativo

1. **Drawer Navigation (Menu Lateral Principal)**
   - **Início**: Tela inicial descrevendo o objetivo e funcionamento do aplicativo.
   - **Sobre**: Tela contendo as informações ("about") do aplicativo e tecnologias utilizadas.
   - **Moedas**: Interface com **Bottom Tabs Navigation** contendo as 3 abas principais.

2. **Bottom Tabs Navigation (Dentro de Moedas)**
   - **Aba Moedas**: Listagem de todas as moedas recuperadas da API (`/codes`), com busca rápida e botão de estrela para favoritar/desfavoritar.
   - **Aba Favoritas**: Listagem apenas das moedas definidas como favoritas pelo usuário.
   - **Aba Converter**: Permite selecionar **Moeda Origem**, **Moeda Destino** e **Valor a ser convertido**, exibindo ao converter:
     - Valor origem
     - Valor destino
     - Taxa de conversão utilizada

## Como Executar no Expo Snack (`snack.expo.dev`)

1. Acesse [https://snack.expo.dev](https://snack.expo.dev).
2. Copie todo o código do arquivo `App.js` e cole no `App.js` do Snack (ou importe os arquivos `App.js` e `package.json`).
3. Caso o Snack exiba o aviso de dependências na parte inferior da tela, clique em **Add dependencies** para adicionar automaticamente:
   - `@react-navigation/native`
   - `@react-navigation/drawer`
   - `@react-navigation/bottom-tabs`
   - `react-native-gesture-handler`
   - `react-native-reanimated`
   - `react-native-safe-area-context`
   - `react-native-screens`
   - `@expo/vector-icons`
