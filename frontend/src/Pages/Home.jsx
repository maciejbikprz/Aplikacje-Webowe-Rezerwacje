function Home() {
    return (
    <>
        <div className="main-center">

        <main className="main-homepage">
            <h1 className="main-homepage-header">Witamy w SailReservations!</h1>
            <section className="main-homepage-section">
                <h2 className="main-homepage-section__header">Zarezerwuj Idealną Żaglówkę</h2>
                <p className="main-homepage-section__paragraph">

                Szukasz idealnej łodzi na weekendowy rejs, regaty lub spokojne popołudnie na wodzie? 
                <br /> <br />
                SailReservations to najprostszy sposób na przeglądanie, porównywanie i rezerwowanie dostępnych żaglówek w Twojej okolicy.
                Niezależnie od tego, czy jesteś doświadczonym żeglarzem, czy dopiero zaczynasz przygodę z wodą, znajdziesz u nas jednostkę dopasowaną do Twoich potrzeb i kwalifikacji.
                </p>
            </section>
            <section>
                <a className="main-homepage__link" href="/boats">SZUKAJ</a>
            </section>
        </main>
        </div>
    </>)
}
export default Home;