# CORE do RN
## Núcleo do React Navigation

 - Primeiro, o núcleo do React Navigation. Ele é o cérebro de tudo, mas sozinho não faz nada visível ainda — é só a fundação. O comando é:

> npm install @react-navigation/native

=========================================================================================
## Bibliotecas de apoio do rn

 - Deixa eu te explicar o que cada uma faz, porque é interessante. A "react-native-screens" faz o seu app usar as telas nativas de verdade do sistema, o que deixa a navegação mais leve e rápida na memória. E a "react-native-safe-area-context" é a que cuida pra que o conteúdo do seu app não fique escondido atrás daquelas áreas especiais do celular — como o entalhe da câmera no topo, ou a barrinha de gestos embaixo.

> npx expo install react-native-screens react-native-safe-area-context

=========================================================================================

## Diferença entre npm e npx

 - O "npx" executa um pacote uma única vez, sem instalar nada permanente no seu projeto. Foi o que usamos pra criar o projeto: você rodou o "create-expo-app" uma vez, ele montou a pasta e pronto, não precisa dele guardado ali pra sempre. É uma ferramenta de uso único.

 - Já o "npm install" baixa uma biblioteca e guarda ela dentro do seu projeto, como uma dependência permanente. O React Navigation precisa estar sempre presente, porque o seu app usa ele toda vez que roda. Por isso usamos "install" — a gente quer que ele fique salvo no projeto, registrado no tal do package.json.

`Resumindo: npx é pra "executar e esquecer", e npm install é pra "baixar e guardar".`

=========================================================================================
# Stack

 - Repara que aqui voltamos pro "npm install" normal, e não o "npx expo install". Sabe por quê? Porque o native-stack, apesar do nome, usa por baixo a react-native-screens que a gente já instalou agora há pouco. Ele próprio não traz código nativo novo pra configurar, então o npm install normal dá conta.

> npm install @react-navigation/native-stack

=========================================================================================
## Estilização Header

Primeiro, o flexDirection row, que faz os filhos ficarem lado a lado na horizontal. E comentei um detalhe interessante: no React Native o padrão é column, empilhado na vertical, ao contrário da web onde o padrão é row. Então você mudou de propósito.

Segundo, o justifyContent space-between, que joga o primeiro filho pra esquerda e o último pra direita, com o espaço sobrando no meio. É o padrão clássico de cabeçalho: título de um lado, botão do outro.

Terceiro, o alignItems center, que alinha tudo no centro verticalmente, pra o texto e o botão ficarem na mesma altura.

E quarto, o width cem por cento, que garante que ele ocupe a largura toda do espaço disponível, senão o space-between não teria espaço pra distribuir.

=========================================================================================
## ...rest, {...rest}

O ...rest nos parâmetros junta todas as propriedades que você não nomeou explicitamente num único objeto. Você nomeou só o icon, então qualquer outra coisa que chegar — onPress, activeOpacity, disabled, style — cai dentro do rest.

E o {...rest} na tag espalha todas elas de volta no TouchableOpacity. Ou seja: seu componente aceita qualquer propriedade de toque sem você precisar declarar uma por uma. É o jeito que bibliotecas profissionais escrevem componentes.

Boa pergunta, e essa confunde muita gente — porque os dois usam exatamente os mesmos três pontinhos, mas fazem coisas opostas. Deixa eu separar.

=========================================================================================
### Spread x Rest
O termo técnico é "spread", com D no final, não "spray" — provavelmente foi isso que você ouviu. Spread quer dizer "espalhar". E o nome muda conforme onde você usa os três pontinhos.

Quando os três pontinhos aparecem num lugar que está recebendo coisas, tipo nos parâmetros de uma função, ele se chama rest. O papel dele é juntar — ele recolhe tudo que sobrou e amarra num pacote só. Foi o que você fez no ButtonIcon: icon e depois ...rest. Ali o rest junta todas as propriedades restantes num objeto.

Já quando os três pontinhos aparecem num lugar que está usando ou passando coisas adiante, ele se chama spread. O papel dele é o contrário: espalhar, desembrulhar o pacote. Foi o que você fez na tag: TouchableOpacity, abre chave, ...rest. Ali o spread pega aquele pacote e espalha cada propriedade de volta no elemento.

Então, resumindo: mesmos três pontinhos, papéis opostos. O rest junta, lá na hora de receber. O spread espalha, lá na hora de usar. Uma forma de lembrar: rest é como você guardar suas compras numa sacola só; spread é tirar tudo da sacola e espalhar na bancada.

=========================================================================================
useNavigation()

Três coisas, então, que eu garantiria que o aluno leva pra casa. Primeira: useNavigation é um hook que dá acesso ao controle de navegação. Segunda: ele existe pra tela não precisar receber a navegação de fora, de mão em mão. E terceira: ele só funciona dentro do NavigationContainer, que é quem fornece esse poder.
Um último detalhe prático, que ajuda bastante na hora de ensinar: o método mais usado desse objeto é o navigation.navigate, que leva pra uma rota pelo nome. Mas tem outros que o seu material lista na tabela de referência, como o goBack pra voltar, o openDrawer pra abrir o menu. Mostrar dois ou três desses em aula já dá pro aluno a noção de que o controle remoto tem vários botões.

=========================================================================================
## index.jsx - Navigation Container

O cérebro da navegação: ele guarda qual tela está aberta e o histórico, e distribui essa informação pra todas as telas do app. É por causa dele que o useNavigation funciona lá nas telas.

Repara que ele envolve o StackRoutes. Ou seja: o container por fora, e o navegador de pilha por dentro. E tem uma regra de ouro que o seu material destaca: o NavigationContainer aparece uma única vez no app inteiro. Colocar dois dá erro.

=========================================================================================

# Botton Tabs

