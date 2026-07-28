/**
 * Migration Script — Marcelo Gnisci Web
 *
 * Migrates the 4 existing stories from static HTML to Supabase.
 * Uploads images to Supabase Storage and inserts story data.
 *
 * Usage:
 *   node scripts/migrate.js YOUR_EMAIL YOUR_PASSWORD
 *
 * Run this once after setting up Supabase.
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const supabaseUrl = 'https://iwhjwpxnqetwbwelwkud.supabase.co'
const supabaseAnonKey = 'sb_publishable_22T6luFW5B9gBbCf7r7cGw_MtoNREJ1'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ─── Story Data ──────────────────────────────────────────
const stories = [
  {
    title: 'Negro & Metal & Roma',
    slug: 'negro-metal-roma',
    image: 'negro-metal-roma.jpg',
    signature: 'Marcelo Gnisci, Enero 2026.',
    excerpt: 'Amo el negro. No como un color. Como una postura. Me visto de negro porque soy heavy metal',
    content: `Negro
Amo el negro.
No como un color.
Como una postura.
Me visto de negro porque soy heavy metal.
Porque de chico me decían "hola, negro".
Porque mi pelo es negro
y porque no hay armadura más honesta
que una campera negra con tachas
brillando al sol,
metálica, hermética,
como un riff de Black Sabbath
que no explica nada
y lo dice todo.
Botas negras.
Paso firme.
Alma fuerte.
El negro no es ausencia.
El negro es peso.
Es raíz.
Es verdad sin maquillaje.
Y después está ella.
Roma.
Galga.
Negra.
Negra como la noche espesa,
esa que no pide permiso para existir.
Negra como el silencio antes del golpe.
Como el fondo donde vibra lo real.
A veces pienso que por eso estoy enamorado de ella.
Porque nos reconocemos en lo oscuro.
Porque caminamos juntos
fundidos en un mismo pulso,
como decía Iorio:
fundido con vos estoy.
No hablamos.
No hace falta.
Ella a mi lado.
Yo con mi sombra.
Dos cuerpos negros avanzando
sobre el asfalto
como si el mundo fuera un escenario
y el resto solo ruido.
Hay vínculos que no son suaves.
Son leales.
Son pesados.
Son eternos.
Y cuando Roma camina a mi lado,
negra, firme, silenciosa,
sé que no es casualidad.
Hay amores
que no se dicen.
Se sienten en el pecho
como un riff grave
que no se apaga nunca.
🖤🐾`
  },
  {
    title: 'Cuando los silencios también hablan',
    slug: 'cuando-los-silencios-tambien-hablan',
    image: 'cuando-los-silencios-tambien-hablan.jpg',
    signature: 'Marcelo Gnisci, Enero 2026.',
    excerpt: 'Dicen que a los perros hay que hablarles. Que hay que decirles las cosas claras, marcarles el camino',
    content: `Dicen que a los perros hay que hablarles.
Que hay que decirles las cosas claras, marcarles el camino, enseñarles con palabras.
Algunos incluso aseguran que hay que "educarlos" para que entiendan.
Yo escucho… y sonrío.
Porque nadie me explicó cómo hacer para que Roma, mi galguita, venga despacio, apoye su hocico tibio en mi mano y la levante apenas, lo justo, como diciendo: "Es ahora. Es mío este momento. Acariciame".
No ladra.
No insiste.
Solo pide… y el mundo se detiene.
Nadie me enseñó tampoco qué idioma habla cuando baja las orejas, inclina la cabeza y me mira con esos ojos que no preguntan, sino que proponen.
¿Salimos?
¿Seguimos?
¿Nos quedamos un rato más?
Y cuando caminamos, pasa eso otro… eso que no se puede explicar sin que se apriete el pecho.
De repente, sin aviso, nos miramos.
Un cruce de miradas simple.
Nada extraordinario para el que pasa por al lado.
Pero para nosotros… el mundo se frena.
Seguimos caminando.
Tres pasos.
Cuatro.
Cinco.
Mirándonos.
Como si el paseo, la vereda, el ruido, el tiempo… todo desapareciera.
Y solo quedáramos ella y yo, compartiendo ese instante suspendido.
Después, casi al mismo tiempo, cada uno vuelve a mirar para adelante, como si nada.
Como si no hubiera pasado nada.
Pero pasó todo.
Y eso sucede siempre.
No una vez.
Tres, cuatro veces por paseo.
Como si estuviéramos esperando ese momento exacto en el que el mundo se deja pausar para mirarnos y decirnos, sin palabras: "Estoy acá. Con vos".
Después, sí.
Seguimos.
Ella hace sus cosas.
Yo las mías.
La caminata continúa.
Y en medio de eso, llega lo otro.
Se da vuelta de repente.
Me mira.
Y ya sé.
No es por acá.
Es por el otro lado.
No tira de la correa.
No se planta con capricho.
Abre apenas la boca en la esquina, me mira de reojo y espera.
Como si dijera: "Confiá. Te llevo bien".
A veces se detiene.
Olfatea el aire.
Las orejas se le levantan como antenas del alma.
Y ahí está la señal.
Ese camino no.
Ese otro sí.
Y yo la sigo.
Porque en algún punto, sin darnos cuenta, dejamos de ser dos.
Hay algo que se mezcla, que se funde, que se vuelve una sola respiración caminando por la vereda.
Eso que llaman simbiosis, pero que en realidad es mucho más simple y mucho más profundo.
No hace falta hablar.
No hace falta enseñar.
No hace falta corregir.
Alcanza con mirarnos.
Un cruce de ojos.
Un gesto mínimo.
Una pausa en medio del mundo.
Y el corazón…
el corazón no aguanta tanta belleza.
Explota de emoción, pero de esa emoción buena, de la que no duele.
Esa que te reconforta el alma.
Esa que te recuerda que todavía estás vivo, que todavía podés sentir, que todavía existe un lenguaje donde no hay ruido.
Roma no entiende mis palabras.
Y yo no entiendo sus pensamientos.
Pero nos entendemos.
Y en ese silencio compartido,
en esos tres, cuatro, cinco pasos mirándonos mientras el mundo se detiene,
el alma —sin pedir permiso—
reflorece.`
  },
  {
    title: 'Cuando Roma me llevó al mar',
    slug: 'cuando-roma-me-llevo-al-mar',
    image: 'cuando-roma-me-llevo-al-mar.jpg',
    signature: 'Marcelo Gnisci, Enero 2026.',
    excerpt: 'Llegó el día. Llegó, al fin, el día en que volvimos a la playa. A mi amada San Clemente del Tuyú',
    content: `Llegó el día.
Llegó, al fin, el día en que volvimos a la playa.
A mi amada San Clemente del Tuyú.
Ese día en que uno se afloja la correa por dentro, aunque la de afuera siga firme. Ese día en que el sol no quema, pero abraza. Tibio. Justo. Invitando.
Salimos a la calle sin apuro, pero con destino. Con esa sensación de viaje corto que, sin embargo, es enorme.
Yo caminaba… y Roma sabía.
No sé en qué momento dejó de caminar y empezó a marcar el rumbo. La correa, que al principio colgaba dócil, comenzó a tensarse. No por ansiedad: por certeza. Cabeza alta, orejas bien puntiagudas, mirada firme. Ella conocía ese camino mejor que yo.
Yo la seguía, intrigado, preguntándome cómo sería ese reencuentro. El mío… y el suyo.
Cada paso acercaba algo que no se ve, pero se siente.
Cruzamos la Costanera y ahí todo cambió.
Fue como un rayo.
Escalinatas arriba, escalón por escalón, sin mirar atrás, como si el mundo entero hubiera quedado de ese lado de la avenida. Todo era ahora. Todo era ya.
Y entonces… la arena.
Apenas la tocó, se frenó.
Se dio vuelta.
Esa mirada cómplice, esa sonrisa de cábana feliz, ese "¿viste?" sin palabras.
—Llegamos —decía sin hablar.
Y ahí apareció esa emoción entrecortada, esa mezcla rara de felicidad pura y nudo en la garganta. Porque cuando un perro es feliz, uno se reconoce mejor persona.
Un salto de canguro.
Y a correr.
Siempre con la correa. No suelta. Nunca suelta.
Cinco metros libres. Vuelve.
Corre en círculo. Salta.
Todavía no habíamos llegado al agua… y ya estaba explotando de alegría.
Esos cincuenta metros hasta el mar se volvieron interminables.
La correa tiraba.
La mano dolía.
No había fuerza que alcanzara para frenar esa emoción desbordada.
Y cuando por fin tocamos el agua… empezó otra historia.
Correr en círculos.
Saltar.
Mirarse.
Compartir.
Ese sentimiento simple y gigante de felicidad`
  },
  {
    title: 'Miradas cómplices',
    slug: 'miradas-complices',
    image: 'miradas-complices.jpg',
    signature: 'Marcelo Gnisci, Enero 2026.',
    excerpt: 'Me desperté y lo primero que hice fue asomarme al día. Un día gris, de esos que no piden permiso',
    content: `Me desperté y lo primero que hice fue asomarme al día.
Un día gris, de esos que no piden permiso: frío filoso, lluvia fina, cielo bajo y nublado, como si el mundo hubiera decidido hablar en voz baja.
Me quedé un momento ahí, parado, pensando qué hacer de mí. Y entonces, sin demasiadas vueltas, lo supe: iba a pintar.
Me vestí sin ceremonias. Un pantalón blanco de carhuomo, con esas rayitas rojitas al costado que ya conocen más inviernos que yo. Una remera fea —de las feas de verdad, sin ningún mérito— y una camperita roja y azul que tranquilamente podría contar historias de hace ciento cincuenta años. Me miré rápido, sin juicio. Estaba listo.
En eso aparece Roma.
Me mira. No con los ojos, sino con esa cara que lo dice todo: ¿salimos?
—Roma, mirá cómo está el día… —le digo, intentando negociar con la lógica.
Ella inclina la cabeza, pone esa carita mitad súplica, mitad ilusión.
¿Querés ir a pasear?
Bueno. Vamos a pasear.
Le pongo la correa y salimos. Llovizna. Frío. Ese frío que se te mete por las mangas.
—¿No querrás ir a la playa, no? —pregunto, más para mí que para ella.
Roma me mira fijo. Playa. Siempre playa.
Seguimos. La gente vuelve, sale de la playa, apurada, como escapando de algo que no se puede disfrutar bajo la lluvia. Nosotros entramos.
Roma hace lo suyo —pis, caca— con la solemnidad de quien cumple un ritual.
La playa está vacía. Un desierto húmedo. Solo nosotros.
En lugar de ir hacia el muelle, como los días anteriores, giro para el otro lado.
Caminamos.
El mar está ahí, inmenso, y al costado, las algas: todas alineadas, parejas, como si alguien las hubiera acomodado a propósito. Miro alrededor y siento algo extraño, como si hubiéramos comprado un pedazo de paraíso sin darnos cuenta. Una playa solo para nosotros. Lluvia leve, silencio, agua, algas, distancia.
El frío que al principio molestaba empieza a transformarse. Ya no duele. Acompaña.
Se vuelve placer.
Nos miramos. Cómplices.
Y de golpe, corremos. Jugamos. Nos perdemos un poco en ese silencio donde solo se oyen las olas y la respiración. La playa es nuestra.
Encuentro un palo. Lo agarro. Un gesto medio infantil, medio trompesco. Empiezo a escarbar. Roma se suma. Escarbar, escarbar, escarbar. El mundo queda reducido a eso: arena, patas, manos, risa sin ruido.
La lluvia se va. Como si entendiera que ya cumplió su papel.
El frío afloja. El cielo empieza a abrirse.
Subimos a un médano, cerca del vivero. Me siento. Respiro.
Y entonces pasa.
Las nubes se separan apenas y un rayo de sol cae directo sobre el mar. Un haz perfecto, como si alguien lo hubiera apuntado con intención. La playa mojada brilla. El agua respira luz.
Roma se sienta a mi lado. Justo ahí. Todo alineado.
No hace falta decir nada.
Nos quedamos cinco, siete minutos. No importa. El tiempo no cuenta cuando es así.
Un momento mágico. De esos que no se explican, solo se guardan.
Y ahí, en esa especie de fortaleza invisible, entiendo algo simple:
cómo arranqué el día, cómo estaba vestido, el frío, la lluvia, nada de eso importa.
Lo único que vale es saber estar cuando la vida te regala estos instantes.
Únicos.
Mágicos.`
  }
]

// ─── Migration ───────────────────────────────────────────
async function migrate() {
  const email = process.argv[2]
  const password = process.argv[3]

  if (!email || !password) {
    console.error('❌ Uso: node scripts/migrate.js TU_EMAIL TU_PASSWORD')
    console.error('   Ejemplo: node scripts/migrate.js admin@ejemplo.com micontraseña')
    process.exit(1)
  }

  console.log('🔐 Iniciando sesión...')
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password })

  if (authError) {
    console.error('❌ Error de autenticación:', authError.message)
    process.exit(1)
  }

  console.log('✅ Sesión iniciada como:', authData.user.email)

  const publicDir = path.resolve(__dirname, '..', 'public')

  for (const story of stories) {
    console.log(`\n📝 Procesando: ${story.title}`)

    // Upload image
    let image_url = null
    const imagePath = path.join(publicDir, story.image)

    if (fs.existsSync(imagePath)) {
      console.log(`  📷 Subiendo imagen: ${story.image}`)
      const imageBuffer = fs.readFileSync(imagePath)

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('story-images')
        .upload(story.image, imageBuffer, {
          contentType: 'image/jpeg',
          upsert: true
        })

      if (uploadError) {
        console.error(`  ⚠️ Error subiendo imagen: ${uploadError.message}`)
      } else {
        const { data: { publicUrl } } = supabase.storage
          .from('story-images')
          .getPublicUrl(story.image)
        image_url = publicUrl
        console.log(`  ✅ Imagen subida: ${publicUrl}`)
      }
    } else {
      console.log(`  ⚠️ Imagen no encontrada: ${imagePath}`)
    }

    // Insert story
    console.log(`  💾 Insertando relato...`)
    const { error: insertError } = await supabase
      .from('stories')
      .insert([{
        title: story.title,
        slug: story.slug,
        content: story.content,
        excerpt: story.excerpt,
        image_url,
        signature: story.signature,
        published: true
      }])

    if (insertError) {
      if (insertError.code === '23505') {
        console.log(`  ⏭️ Ya existe (slug: ${story.slug}), saltando...`)
      } else {
        console.error(`  ❌ Error insertando: ${insertError.message}`)
      }
    } else {
      console.log(`  ✅ Relato insertado correctamente`)
    }
  }

  console.log('\n🎉 Migración completada!')
  console.log('   Los relatos ya están disponibles en el sitio.')
  process.exit(0)
}

migrate()
