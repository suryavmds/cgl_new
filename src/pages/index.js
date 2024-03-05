import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main>
      {/* <section className="main_gamelist">
        <div className="cgl_gameitem">
          <img src="/gamelogo/pubg.png"></img>
        </div>
        <div className="cgl_gameitem active">
          <img src="/gamelogo/apex.png"></img>
        </div>
        <div className="cgl_gameitem">
          <img src="/gamelogo/cod.png"></img>
        </div>
      </section> */}
      
      <section className="tourn_list">
        <div className='tourn_item'>
          
        </div>
      </section>
    </main>
  )
}
