export class CurrencyFormatter {
   private constructor () {}

   public static format(amount: number): string {
      return new Intl.NumberFormat("es-PE", {
         style: "currency",
         currency: "PEN",
      }).format(amount);
   }
}