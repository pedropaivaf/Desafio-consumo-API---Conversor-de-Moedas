import 'react-native-gesture-handler';
import React, { useState, useEffect, createContext, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Chave e URL da API ExchangeRate-API
const API_KEY = 'e4c645e49f929d626b847c2b';
const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}`;

// Contexto simples para compartilhar a lista de moedas e favoritas entre as abas
const MoedasContext = createContext();

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

// =======================================================
// 1. TELA PRINCIPAL (INÍCIO)
// =======================================================
function TelaInicio({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.heroCard}>
        <View style={styles.iconCircle}>
          <Ionicons name="cash-outline" size={42} color="#16a34a" />
        </View>
        <Text style={styles.heroTitle}>Conversor de Moedas</Text>
        <Text style={styles.heroSubtitle}>
          Aplicativo simples e prático para consulta e conversão de moedas em tempo real.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Objetivo do Aplicativo</Text>
        <Text style={styles.paragraph}>
          Este aplicativo tem como objetivo permitir a visualização de todas as moedas
          mundiais suportadas pela ExchangeRate-API, o gerenciamento de uma lista de
          moedas favoritas e a conversão de valores entre diferentes moedas utilizando
          taxas de câmbio atualizadas.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Como navegar</Text>

        <View style={styles.stepRow}>
          <Ionicons name="list-circle-outline" size={26} color="#2563eb" />
          <View style={styles.stepTextContainer}>
            <Text style={styles.stepTitle}>Aba Moedas</Text>
            <Text style={styles.stepDesc}>
              Consulte a listagem completa de moedas da API e marque suas favoritas.
            </Text>
          </View>
        </View>

        <View style={styles.stepRow}>
          <Ionicons name="star-outline" size={26} color="#eab308" />
          <View style={styles.stepTextContainer}>
            <Text style={styles.stepTitle}>Aba Favoritas</Text>
            <Text style={styles.stepDesc}>
              Acesse rapidamente as moedas que você marcou como favoritas.
            </Text>
          </View>
        </View>

        <View style={styles.stepRow}>
          <Ionicons name="swap-horizontal-outline" size={26} color="#16a34a" />
          <View style={styles.stepTextContainer}>
            <Text style={styles.stepTitle}>Aba Converter</Text>
            <Text style={styles.stepDesc}>
              Escolha a moeda origem, moeda destino e o valor para calcular a conversão.
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => navigation.navigate('Moedas')}
      >
        <Text style={styles.primaryButtonText}>Ir para Moedas e Conversor</Text>
        <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 8 }} />
      </TouchableOpacity>
    </ScrollView>
  );
}

// =======================================================
// 2. TELA SOBRE
// =======================================================
function TelaSobre() {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.card}>
        <View style={styles.aboutHeader}>
          <Ionicons name="information-circle-outline" size={48} color="#2563eb" />
          <Text style={styles.aboutTitle}>Sobre o App</Text>
          <Text style={styles.versionBadge}>Versão 1.0.0</Text>
        </View>

        <Text style={styles.paragraph}>
          O <Text style={{ fontWeight: 'bold' }}>Conversor de Moedas</Text> foi desenvolvido
          como atividade prática acadêmica de desenvolvimento mobile utilizando React Native
          e Expo.
        </Text>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Características Técnicas</Text>
        <Text style={styles.bulletItem}>• Framework: React Native (Expo Snack)</Text>
        <Text style={styles.bulletItem}>• Navegação Principal: Drawer Navigation</Text>
        <Text style={styles.bulletItem}>• Navegação de Moedas: Bottom Tabs Navigation</Text>
        <Text style={styles.bulletItem}>• API Consumida: ExchangeRate-API (v6)</Text>
        <Text style={styles.bulletItem}>• Documentação: exchangerate-api.com/docs/overview</Text>
      </View>
    </ScrollView>
  );
}

// =======================================================
// 3. ABA MOEDAS (Listagem de todas as moedas da API)
// =======================================================
function AbaMoedas() {
  const { moedas, carregando, erro, favoritas, alternarFavorita, carregarMoedas } =
    useContext(MoedasContext);
  const [busca, setBusca] = useState('');

  const moedasFiltradas = moedas.filter(
    (item) =>
      item.codigo.toLowerCase().includes(busca.toLowerCase()) ||
      item.nome.toLowerCase().includes(busca.toLowerCase())
  );

  if (carregando) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Carregando moedas da API...</Text>
      </View>
    );
  }

  if (erro) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#dc2626" />
        <Text style={styles.errorText}>{erro}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={carregarMoedas}>
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.tabContainer}>
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={20} color="#64748b" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por sigla (ex: BRL, USD) ou nome..."
          placeholderTextColor="#94a3b8"
          value={busca}
          onChangeText={setBusca}
        />
        {busca.length > 0 && (
          <TouchableOpacity onPress={() => setBusca('')}>
            <Ionicons name="close-circle" size={20} color="#94a3b8" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={moedasFiltradas}
        keyExtractor={(item) => item.codigo}
        contentContainerStyle={{ paddingBottom: 16 }}
        renderItem={({ item }) => {
          const isFav = favoritas.includes(item.codigo);
          return (
            <View style={styles.currencyItem}>
              <View style={styles.codeBadge}>
                <Text style={styles.codeBadgeText}>{item.codigo}</Text>
              </View>
              <View style={styles.currencyInfo}>
                <Text style={styles.currencyName}>{item.nome}</Text>
                <Text style={styles.currencyCodeSub}>Código: {item.codigo}</Text>
              </View>
              <TouchableOpacity
                style={styles.favButton}
                onPress={() => alternarFavorita(item.codigo)}
              >
                <Ionicons
                  name={isFav ? 'star' : 'star-outline'}
                  size={24}
                  color={isFav ? '#eab308' : '#94a3b8'}
                />
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
}

// =======================================================
// 4. ABA FAVORITAS (Listagem de moedas favoritadas)
// =======================================================
function AbaFavoritas() {
  const { moedas, favoritas, alternarFavorita } = useContext(MoedasContext);

  const listaFavoritas = moedas.filter((item) => favoritas.includes(item.codigo));

  if (listaFavoritas.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="star-outline" size={56} color="#cbd5e1" />
        <Text style={styles.emptyTitle}>Nenhuma moeda favoritada</Text>
        <Text style={styles.emptySubtitle}>
          Vá até a aba "Moedas" e toque na estrela ao lado das moedas que deseja salvar aqui.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.tabContainer}>
      <FlatList
        data={listaFavoritas}
        keyExtractor={(item) => item.codigo}
        contentContainerStyle={{ paddingBottom: 16 }}
        renderItem={({ item }) => (
          <View style={styles.currencyItem}>
            <View style={[styles.codeBadge, { backgroundColor: '#fef9c3' }]}>
              <Text style={[styles.codeBadgeText, { color: '#a16207' }]}>{item.codigo}</Text>
            </View>
            <View style={styles.currencyInfo}>
              <Text style={styles.currencyName}>{item.nome}</Text>
              <Text style={styles.currencyCodeSub}>Moeda Favorita</Text>
            </View>
            <TouchableOpacity
              style={styles.favButton}
              onPress={() => alternarFavorita(item.codigo)}
            >
              <Ionicons name="star" size={24} color="#eab308" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

// =======================================================
// 5. ABA CONVERTER (Conversão entre moedas)
// =======================================================
function AbaConverter() {
  const { moedas } = useContext(MoedasContext);

  const [moedaOrigem, setMoedaOrigem] = useState('BRL');
  const [moedaDestino, setMoedaDestino] = useState('USD');
  const [valor, setValor] = useState('99');

  const [convertendo, setConvertendo] = useState(false);
  const [resultado, setResultado] = useState(null);

  // Controle do Modal de seleção de moeda
  const [modalVisivel, setModalVisivel] = useState(false);
  const [tipoSelecao, setTipoSelecao] = useState('origem'); // 'origem' ou 'destino'
  const [buscaModal, setBuscaModal] = useState('');

  const obterRotuloMoeda = (codigo) => {
    const encontrada = moedas.find((m) => m.codigo === codigo);
    return encontrada ? `${encontrada.nome} (${encontrada.codigo})` : codigo;
  };

  const abrirSeletor = (tipo) => {
    setTipoSelecao(tipo);
    setBuscaModal('');
    setModalVisivel(true);
  };

  const selecionarMoeda = (codigo) => {
    if (tipoSelecao === 'origem') {
      setMoedaOrigem(codigo);
    } else {
      setMoedaDestino(codigo);
    }
    setModalVisivel(false);
  };

  const realizarConversao = async () => {
    const valorNumerico = parseFloat(valor.replace(',', '.'));

    if (!valor || isNaN(valorNumerico) || valorNumerico <= 0) {
      Alert.alert('Atenção', 'Informe um valor numérico válido maior que zero.');
      return;
    }

    try {
      setConvertendo(true);
      const resposta = await fetch(
        `${API_URL}/pair/${moedaOrigem}/${moedaDestino}/${valorNumerico}`
      );
      const dados = await resposta.json();

      if (dados.result === 'success') {
        setResultado({
          valorOrigem: valorNumerico,
          moedaOrigem: dados.base_code,
          valorDestino: dados.conversion_result,
          moedaDestino: dados.target_code,
          taxaConversao: dados.conversion_rate,
        });
      } else {
        Alert.alert('Erro na conversão', 'Não foi possível obter a cotação na API.');
      }
    } catch (e) {
      Alert.alert('Erro de conexão', 'Verifique sua conexão com a internet.');
    } finally {
      setConvertendo(false);
    }
  };

  const moedasModalFiltradas = moedas.filter(
    (item) =>
      item.codigo.toLowerCase().includes(buscaModal.toLowerCase()) ||
      item.nome.toLowerCase().includes(buscaModal.toLowerCase())
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.converterHeaderBanner}>
        <Text style={styles.converterHeaderTitle}>Converter Moeda</Text>
      </View>

      <View style={styles.card}>
        {/* Seleção da Moeda Origem */}
        <Text style={styles.fieldLabel}>Moeda Origem *</Text>
        <TouchableOpacity
          style={styles.selectorBox}
          onPress={() => abrirSeletor('origem')}
        >
          <Text style={styles.selectorText} numberOfLines={1}>
            {obterRotuloMoeda(moedaOrigem)}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#475569" />
        </TouchableOpacity>

        {/* Seleção da Moeda Destino */}
        <Text style={styles.fieldLabel}>Moeda Destino *</Text>
        <TouchableOpacity
          style={styles.selectorBox}
          onPress={() => abrirSeletor('destino')}
        >
          <Text style={styles.selectorText} numberOfLines={1}>
            {obterRotuloMoeda(moedaDestino)}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#475569" />
        </TouchableOpacity>

        {/* Valor a ser convertido */}
        <Text style={styles.fieldLabel}>Valor *</Text>
        <View style={styles.inputBox}>
          <Text style={styles.inputPrefix}>{moedaOrigem}</Text>
          <TextInput
            style={styles.valueInput}
            keyboardType="numeric"
            placeholder="Digite o valor (ex: 99)"
            placeholderTextColor="#94a3b8"
            value={valor}
            onChangeText={setValor}
          />
        </View>

        {/* Botão Converter */}
        <TouchableOpacity
          style={styles.convertButton}
          onPress={realizarConversao}
          disabled={convertendo}
        >
          {convertendo ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.convertButtonText}>Calcular Conversão</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Exibição do Resultado da Conversão (conforme Figura 1 das instruções) */}
      {resultado && (
        <View style={styles.resultCard}>
          <Text style={styles.resultOriginText}>
            {resultado.valorOrigem} em {resultado.moedaOrigem} equivale a
          </Text>

          <Text style={styles.resultTargetText}>
            {resultado.valorDestino} em {resultado.moedaDestino}
          </Text>

          <Text style={styles.resultRateText}>
            Taxa de conversão utilizada: {resultado.taxaConversao}
          </Text>

          <View style={styles.resultDetailsBox}>
            <Text style={styles.resultDetailLine}>
              • Valor origem: {resultado.valorOrigem} {resultado.moedaOrigem}
            </Text>
            <Text style={styles.resultDetailLine}>
              • Valor destino: {resultado.valorDestino} {resultado.moedaDestino}
            </Text>
            <Text style={styles.resultDetailLine}>
              • Taxa de conversão: {resultado.taxaConversao}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.closeResultButton}
            onPress={() => setResultado(null)}
          >
            <Text style={styles.closeResultButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal para escolher a moeda */}
      <Modal visible={modalVisivel} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Selecionar {tipoSelecao === 'origem' ? 'Moeda Origem' : 'Moeda Destino'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisivel(false)}>
                <Ionicons name="close" size={24} color="#334155" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalSearch}>
              <Ionicons name="search-outline" size={18} color="#64748b" />
              <TextInput
                style={styles.searchInput}
                placeholder="Filtrar moeda..."
                placeholderTextColor="#94a3b8"
                value={buscaModal}
                onChangeText={setBuscaModal}
              />
            </View>

            <FlatList
              data={moedasModalFiltradas}
              keyExtractor={(item) => item.codigo}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => selecionarMoeda(item.codigo)}
                >
                  <Text style={styles.modalOptionCode}>{item.codigo}</Text>
                  <Text style={styles.modalOptionName}>{item.nome}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

// =======================================================
// NAVEGAÇÃO BOTTOM TABS DA INTERFACE MOEDAS
// =======================================================
function TelaMoedasTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e2e8f0',
          height: 60,
          paddingBottom: 6,
          paddingTop: 6,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName = 'cash-outline';
          if (route.name === 'Moedas') iconName = 'list-outline';
          if (route.name === 'Favoritas') iconName = 'star-outline';
          if (route.name === 'Converter') iconName = 'calculator-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Moedas" component={AbaMoedas} />
      <Tab.Screen name="Favoritas" component={AbaFavoritas} />
      <Tab.Screen name="Converter" component={AbaConverter} />
    </Tab.Navigator>
  );
}

// =======================================================
// COMPONENTE PRINCIPAL DO APP (DRAWER NAVIGATION)
// =======================================================
export default function App() {
  const [moedas, setMoedas] = useState([]);
  const [favoritas, setFavoritas] = useState(['BRL', 'USD', 'EUR']);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const carregarMoedas = async () => {
    try {
      setCarregando(true);
      setErro(null);
      const resposta = await fetch(`${API_URL}/codes`);
      const dados = await resposta.json();

      if (dados.result === 'success' && dados.supported_codes) {
        const listaFormatada = dados.supported_codes.map((item) => ({
          codigo: item[0],
          nome: item[1],
        }));
        setMoedas(listaFormatada);
      } else {
        setErro('Não foi possível carregar a lista de moedas da API.');
      }
    } catch (e) {
      setErro('Erro de conexão ao consultar a API de moedas.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarMoedas();
  }, []);

  const alternarFavorita = (codigo) => {
    setFavoritas((atual) =>
      atual.includes(codigo)
        ? atual.filter((item) => item !== codigo)
        : [...atual, codigo]
    );
  };

  return (
    <MoedasContext.Provider
      value={{
        moedas,
        carregando,
        erro,
        favoritas,
        alternarFavorita,
        carregarMoedas,
      }}
    >
      <NavigationContainer>
        <Drawer.Navigator
          initialRouteName="Início"
          screenOptions={({ route }) => ({
            headerStyle: { backgroundColor: '#1e293b' },
            headerTintColor: '#ffffff',
            headerTitleStyle: { fontWeight: 'bold' },
            drawerActiveTintColor: '#2563eb',
            drawerInactiveTintColor: '#334155',
            drawerIcon: ({ color, size }) => {
              let iconName = 'home-outline';
              if (route.name === 'Início') iconName = 'home-outline';
              if (route.name === 'Sobre') iconName = 'information-circle-outline';
              if (route.name === 'Moedas') iconName = 'cash-outline';
              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}
        >
          <Drawer.Screen name="Início" component={TelaInicio} />
          <Drawer.Screen name="Sobre" component={TelaSobre} />
          <Drawer.Screen name="Moedas" component={TelaMoedasTabs} />
        </Drawer.Navigator>
      </NavigationContainer>
    </MoedasContext.Provider>
  );
}

// =======================================================
// ESTILIZAÇÃO (StyleSheet Puro)
// =======================================================
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f1f5f9',
  },
  tabContainer: {
    flex: 1,
    padding: 12,
    backgroundColor: '#f1f5f9',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f1f5f9',
  },
  heroCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 6,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 21,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 12,
  },
  stepTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  stepDesc: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  aboutHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  aboutTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: 8,
  },
  versionBadge: {
    fontSize: 12,
    color: '#2563eb',
    backgroundColor: '#dbeafe',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 6,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 14,
  },
  bulletItem: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 6,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#0f172a',
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  codeBadge: {
    backgroundColor: '#dbeafe',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    minWidth: 54,
    alignItems: 'center',
  },
  codeBadgeText: {
    fontWeight: 'bold',
    color: '#1d4ed8',
    fontSize: 14,
  },
  currencyInfo: {
    flex: 1,
    marginLeft: 12,
  },
  currencyName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
  },
  currencyCodeSub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  favButton: {
    padding: 6,
  },
  loadingText: {
    marginTop: 10,
    color: '#475569',
    fontSize: 14,
  },
  errorText: {
    marginTop: 10,
    color: '#dc2626',
    fontSize: 14,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 14,
    backgroundColor: '#2563eb',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#334155',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },
  converterHeaderBanner: {
    backgroundColor: '#e2e8f0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  converterHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  fieldLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
    marginTop: 10,
    fontWeight: '600',
  },
  selectorBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1.5,
    borderBottomColor: '#64748b',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  selectorText: {
    fontSize: 15,
    color: '#0f172a',
    flex: 1,
    marginRight: 8,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1.5,
    borderBottomColor: '#64748b',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  inputPrefix: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#334155',
    marginRight: 8,
  },
  valueInput: {
    flex: 1,
    fontSize: 16,
    color: '#0f172a',
    paddingVertical: 4,
  },
  convertButton: {
    backgroundColor: '#1e293b',
    borderWidth: 1.5,
    borderColor: '#0f172a',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 18,
  },
  convertButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  resultCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 18,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    marginTop: 4,
  },
  resultOriginText: {
    fontSize: 14,
    color: '#334155',
    marginBottom: 6,
  },
  resultTargetText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 10,
  },
  resultRateText: {
    fontSize: 13,
    color: '#475569',
    marginBottom: 12,
  },
  resultDetailsBox: {
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  resultDetailLine: {
    fontSize: 13,
    color: '#334155',
    marginBottom: 3,
  },
  closeResultButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#f1f5f9',
    borderWidth: 1.5,
    borderColor: '#0f172a',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 4,
  },
  closeResultButtonText: {
    color: '#0f172a',
    fontSize: 13,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  modalSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalOptionCode: {
    fontWeight: 'bold',
    color: '#2563eb',
    width: 55,
    fontSize: 14,
  },
  modalOptionName: {
    color: '#334155',
    fontSize: 14,
    flex: 1,
  },
});
