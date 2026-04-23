const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mpnmifbhbnmphtkedqtm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wbm1pZmJoYm5tcGh0a2VkcXRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NTU0OTksImV4cCI6MjA5MjUzMTQ5OX0.74yGsksXqOcDtXoI13IDOJwl6GtbFytXHYQqcAfOmNM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createUser() {
    console.log('Tentando criar usuário...');
    const { data, error } = await supabase.auth.signUp({
        email: 'poliveira@roshre.com.br',
        password: 'Pedro123',
    });

    if (error) {
        console.error('Erro na criação:', error.message);
    } else {
        console.log('Usuário criado com sucesso!', data.user.email);
    }
}

createUser();
