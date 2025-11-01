import { fetchPesmaQuestions } from "@/lib/pesma";
import { TestView } from "./_components/test-view";

export default async function TestPage() {
	const questions = await fetchPesmaQuestions();

	return <TestView questions={questions} />;
}
