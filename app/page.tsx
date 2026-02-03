import Link from 'next/link';

export default function Home() {
    return (
        <main>
            <Link href="/send-email">
                <button>
                    Ir a Enviar Correo
                </button>
            </Link>
        </main>
    );
}
